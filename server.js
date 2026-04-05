require('dotenv').config();
const express = require('express');
const { neon } = require('@neondatabase/serverless');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const sql = neon(process.env.DATABASE_URL);

function safeDate(d) {
  if (d == null) return null;
  if (d instanceof Date) return d.toISOString().split('T')[0];
  const m = String(d).match(/(\d{4})-(\d{2})-(\d{2})/);
  return m ? m[0] : null;
}

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ── GET full state ──────────────────────────────
app.get('/api/state', async (req, res) => {
  try {
    const [brands, members, memberBrands, logs, campLogs, settingsRows, campaigns] = await Promise.all([
      sql`SELECT * FROM brands ORDER BY name`,
      sql`SELECT * FROM members ORDER BY name`,
      sql`SELECT * FROM member_brands`,
      sql`SELECT * FROM logs ORDER BY date DESC`,
      sql`SELECT * FROM camp_logs ORDER BY date DESC`,
      sql`SELECT * FROM settings`,
      sql`SELECT * FROM campaigns ORDER BY created_at ASC`,
    ]);

    const settings = {};
    settingsRows.forEach(r => { settings[r.key] = r.value; });

    const brandsFormatted = brands.map(b => ({
      id: b.id, name: b.name, color: b.color,
      goals: { confirmed: b.goal_confirmed, videos: b.goal_videos },
    }));

    const membersFormatted = members.map(m => {
      const mb = memberBrands.filter(r => r.member_id === m.id);
      const roles = {};
      mb.forEach(r => { if (r.role) roles[r.brand_id] = r.role; });
      return { id: m.id, name: m.name, avatarKey: m.id, avatarUrl: m.avatar_url || '', brands: mb.map(r => r.brand_id), roles };
    });

    const logsGrouped = {};
    logs.forEach(l => {
      if (!logsGrouped[l.member_id]) logsGrouped[l.member_id] = [];
      logsGrouped[l.member_id].push({
        date: safeDate(l.date),
        brandId: l.brand_id,
        campaignId: l.campaign_id || null,
        kols_sourced: l.kols_sourced, kols_contacted: l.kols_contacted,
        kols_replied: l.kols_replied, kols_followedup: l.kols_followedup,
        prelim_agree: l.prelim_agree, confirmed: l.confirmed,
        vids_published: l.vids_published, note: l.note || '',
      });
    });

    const campLogsGrouped = {};
    campLogs.forEach(l => {
      if (!campLogsGrouped[l.brand_id]) campLogsGrouped[l.brand_id] = [];
      campLogsGrouped[l.brand_id].push({
        date: safeDate(l.date),
        videos: l.videos, shipped: l.shipped, received: l.received,
      });
    });

    const campaignsGrouped = {};
    campaigns.forEach(c => {
      if (!campaignsGrouped[c.brand_id]) campaignsGrouped[c.brand_id] = [];
      campaignsGrouped[c.brand_id].push({ id: c.id, name: c.name, brandId: c.brand_id });
    });

    res.json({ appName: settings.appName || 'DigitUly', brands: brandsFormatted, members: membersFormatted, logs: logsGrouped, campLogs: campLogsGrouped, campaigns: campaignsGrouped, customAvatars: {} });
  } catch (err) {
    console.error('State error:', err.message);
    res.status(500).json({ error: 'Database error: ' + err.message });
  }
});

// ── Logs ────────────────────────────────────────
app.post('/api/logs', async (req, res) => {
  try {
    const { memberId, brandId, date, kols_sourced, kols_contacted, kols_replied, kols_followedup, prelim_agree, confirmed, vids_published, note, campaignId } = req.body;
    await sql`
      INSERT INTO logs (member_id, brand_id, date, kols_sourced, kols_contacted, kols_replied, kols_followedup, prelim_agree, confirmed, vids_published, note, campaign_id)
      VALUES (${memberId}, ${brandId}, ${date}, ${kols_sourced||0}, ${kols_contacted||0}, ${kols_replied||0}, ${kols_followedup||0}, ${prelim_agree||0}, ${confirmed||0}, ${vids_published||0}, ${note||''}, ${campaignId||null})
      ON CONFLICT (member_id, brand_id, date) DO UPDATE SET
        kols_sourced=EXCLUDED.kols_sourced, kols_contacted=EXCLUDED.kols_contacted,
        kols_replied=EXCLUDED.kols_replied, kols_followedup=EXCLUDED.kols_followedup,
        prelim_agree=EXCLUDED.prelim_agree, confirmed=EXCLUDED.confirmed,
        vids_published=EXCLUDED.vids_published, note=EXCLUDED.note,
        campaign_id=EXCLUDED.campaign_id
    `;
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/logs/:memberId/:brandId/:date', async (req, res) => {
  try {
    await sql`DELETE FROM logs WHERE member_id=${req.params.memberId} AND brand_id=${req.params.brandId} AND date=${req.params.date}`;
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Brands ──────────────────────────────────────
app.post('/api/brands', async (req, res) => {
  try {
    const { id, name, color, goals } = req.body;
    await sql`INSERT INTO brands (id, name, color, goal_confirmed, goal_videos) VALUES (${id}, ${name}, ${color}, ${goals?.confirmed||0}, ${goals?.videos||0})`;
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/brands/:id', async (req, res) => {
  try {
    const { name, color, goals } = req.body;
    await sql`UPDATE brands SET name=COALESCE(${name},name), color=COALESCE(${color},color), goal_confirmed=COALESCE(${goals?.confirmed},goal_confirmed), goal_videos=COALESCE(${goals?.videos},goal_videos) WHERE id=${req.params.id}`;
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Members ─────────────────────────────────────
app.post('/api/members', async (req, res) => {
  try {
    const { id, name, avatarUrl, brands, roles } = req.body;
    await sql`INSERT INTO members (id, name, avatar_url) VALUES (${id}, ${name}, ${avatarUrl||''})`;
    for (const bid of (brands||[])) {
      await sql`INSERT INTO member_brands (member_id, brand_id, role) VALUES (${id}, ${bid}, ${(roles&&roles[bid])||''}) ON CONFLICT DO NOTHING`;
    }
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/members/:id', async (req, res) => {
  try {
    const { name, avatarUrl, brands, roles } = req.body;
    if (name !== undefined) await sql`UPDATE members SET name=${name} WHERE id=${req.params.id}`;
    if (avatarUrl !== undefined) await sql`UPDATE members SET avatar_url=${avatarUrl} WHERE id=${req.params.id}`;
    if (brands !== undefined) {
      await sql`DELETE FROM member_brands WHERE member_id=${req.params.id}`;
      for (const bid of brands) {
        await sql`INSERT INTO member_brands (member_id, brand_id, role) VALUES (${req.params.id}, ${bid}, ${(roles&&roles[bid])||''}) ON CONFLICT DO NOTHING`;
      }
    }
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/members/:id', async (req, res) => {
  try {
    await sql`DELETE FROM members WHERE id=${req.params.id}`;
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Campaigns ───────────────────────────────────
app.post('/api/campaigns', async (req, res) => {
  try {
    const { id, brandId, name } = req.body;
    await sql`INSERT INTO campaigns (id, brand_id, name) VALUES (${id}, ${brandId}, ${name})`;
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/campaigns/:id', async (req, res) => {
  try {
    await sql`DELETE FROM campaigns WHERE id=${req.params.id}`;
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Settings ────────────────────────────────────
app.put('/api/settings', async (req, res) => {
  try {
    await sql`INSERT INTO settings (key, value) VALUES (${req.body.key}, ${req.body.value}) ON CONFLICT (key) DO UPDATE SET value=EXCLUDED.value`;
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Camp logs ───────────────────────────────────
app.post('/api/camp-logs', async (req, res) => {
  try {
    const { brandId, date, videos, shipped, received } = req.body;
    await sql`INSERT INTO camp_logs (brand_id, date, videos, shipped, received) VALUES (${brandId}, ${date}, ${videos||0}, ${shipped||0}, ${received||0}) ON CONFLICT (brand_id, date) DO UPDATE SET videos=EXCLUDED.videos, shipped=EXCLUDED.shipped, received=EXCLUDED.received`;
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Serve app ───────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log('');
  console.log('✅ DigitUly Dashboard rodando!');
  console.log('👉 Abra no browser: http://localhost:' + PORT);
  console.log('');
  console.log('⚠️  Deixe essa janela aberta enquanto usar o app.');
  console.log('');
});
