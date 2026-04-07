/**
 * seed-contract-template.js
 * Inserts the "Carta Acuerdo" contract template for ALL brands.
 *
 * Usage: node seed-contract-template.js
 */
require('dotenv').config();
const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);

const FIELDS = [
  { id: 'marca',              label: 'Marca',                             type: 'text'     },
  { id: 'producto',           label: 'Producto',                          type: 'text'     },
  { id: 'nombre',             label: 'Nombre del Contratado(a)',           type: 'text'     },
  { id: 'cedula',             label: 'DPI / Cédula de Identidad n°',       type: 'text'     },
  { id: 'domicilio',          label: 'Domicilio',                         type: 'text'     },
  { id: 'objeto_entregas',    label: 'Objeto, Alcance y Entregas',        type: 'textarea' },
  { id: 'perfil_publicacion', label: 'Perfil de publicación (URL)',       type: 'text'     },
  { id: 'repost',             label: 'Repost',                            type: 'yes_no'   },
  { id: 'impulsionamiento',   label: 'Impulsionamiento',                  type: 'yes_no'   },
  { id: 'nombre_firma',       label: 'Nombre (Firma del Contratado)',      type: 'text'     },
];

const BODY_HTML = `
<div style="font-family:Arial,sans-serif;font-size:13px;line-height:1.6;color:#1a1f2e">

<p style="font-weight:800;text-align:center;font-size:18px;margin-bottom:6px;letter-spacing:.02em">Carta Acuerdo</p>
<p style="text-align:center;color:#666;margin-bottom:24px;font-size:12px">DigitUly Comercio LTDA</p>

<p style="margin-bottom:16px">Conforme a lo acordado, se presenta el cuadro resumen del servicio contratado y la descripción de las entregas y definiciones de la acción:</p>

<table style="width:100%;border-collapse:collapse;margin:0 0 24px">
  <tbody>
    <tr>
      <td style="padding:9px 14px;font-weight:700;background:#f8f9fb;border:1px solid #e5e7eb;width:200px;vertical-align:top">Contratante</td>
      <td style="padding:9px 14px;border:1px solid #e5e7eb">Digituly Comercio LTDA con domicilio en la ciudad de São Paulo, Al. Santos, 1827, Cerqueira Cesar, Brazil, email: yasmin.mkt@digituly.com, Tel: +55 11 99671-1331</td>
    </tr>
    <tr>
      <td style="padding:9px 14px;font-weight:700;background:#f8f9fb;border:1px solid #e5e7eb;vertical-align:top">Marca</td>
      <td style="padding:9px 14px;border:1px solid #e5e7eb"><strong>{{marca}}</strong></td>
    </tr>
    <tr>
      <td style="padding:9px 14px;font-weight:700;background:#f8f9fb;border:1px solid #e5e7eb;vertical-align:top">Producto</td>
      <td style="padding:9px 14px;border:1px solid #e5e7eb">{{producto}}</td>
    </tr>
    <tr>
      <td style="padding:9px 14px;font-weight:700;background:#f8f9fb;border:1px solid #e5e7eb;vertical-align:top">Contratado(a) / Influenciador(a)</td>
      <td style="padding:9px 14px;border:1px solid #e5e7eb">
        <strong>{{nombre}}</strong> persona natural o jurídica de derecho privado, DPI (Documento Personal de Identificación) / Cédula de Identidad n°: <strong>{{cedula}}</strong> con domicilio en {{domicilio}}
      </td>
    </tr>
    <tr>
      <td style="padding:9px 14px;font-weight:700;background:#f8f9fb;border:1px solid #e5e7eb;vertical-align:top">Objeto, Alcance y Entregas</td>
      <td style="padding:9px 14px;border:1px solid #e5e7eb;white-space:pre-wrap">{{objeto_entregas}}</td>
    </tr>
    <tr>
      <td style="padding:9px 14px;font-weight:700;background:#f8f9fb;border:1px solid #e5e7eb;vertical-align:top">Perfil de publicación</td>
      <td style="padding:9px 14px;border:1px solid #e5e7eb"><a href="{{perfil_publicacion}}" style="color:#3b7ef8">{{perfil_publicacion}}</a></td>
    </tr>
    <tr>
      <td style="padding:9px 14px;font-weight:700;background:#f8f9fb;border:1px solid #e5e7eb;vertical-align:top">Derecho de Uso de Imagen</td>
      <td style="padding:9px 14px;border:1px solid #e5e7eb">
        Repost – {{repost}} &nbsp;&nbsp;&nbsp; Impulsionamiento – {{impulsionamiento}}
      </td>
    </tr>
  </tbody>
</table>

<p><strong>Pago</strong></p>
<p>El presente contrato se encuadra en la modalidad de permuta, por lo que no habrá pago de ningún tipo al Contratado/Influenciador(a). La contraprestación consiste exclusivamente en el intercambio de productos y/o servicios acordados entre las partes, conforme al objeto descrito en este instrumento.</p>

<h3 style="font-size:13px;font-weight:700;margin:20px 0 8px;text-transform:uppercase;letter-spacing:.04em">CLÁUSULA 1ª – DEL PLAZO DE VIGENCIA Y REVISIONES</h3>
<p>El presente instrumento es por plazo determinado de 180 días, iniciando la vigencia a partir del firma de ambas partes del presente acuerdo.</p>
<p>1.2. Las partes acuerdan los siguientes plazos y condiciones para la entrega y revisión de materiales:</p>
<p><strong>Guion:</strong><br>
Elaborar un guion con los puntos principales del video y enviarlo para aprobación en hasta 2 días después de recibir el producto. El Contratante podrá solicitar hasta 1 modificación. El video solo podrá grabarse tras la aprobación del guion.</p>
<p><strong>Video:</strong><br>
Enviar el video grabado para aprobación antes de cualquier edición final. El Contratante podrá solicitar hasta 1 ajuste: corrección de subtítulos, iluminación/audio, re-grabación de algún trecho o cortes de contenido no contemplado en el guion. El video solo podrá publicarse en redes sociales tras la aprobación del Contratante.</p>

<h3 style="font-size:13px;font-weight:700;margin:20px 0 8px;text-transform:uppercase;letter-spacing:.04em">CLÁUSULA 2ª – DEL CONTRATADO</h3>
<p>2.1. Sin perjuicio de las demás disposiciones de este contrato, constituyen obligaciones del Contratado:<br>
(i) Prestar los servicios con diligencia y en los plazos establecidos en el contrato, de acuerdo con la legislación vigente y las buenas costumbres.<br>
(ii) Incluir demás obligaciones necesarias bajo responsabilidad del Contratado.</p>

<h3 style="font-size:13px;font-weight:700;margin:20px 0 8px;text-transform:uppercase;letter-spacing:.04em">CLÁUSULA 3ª – DE LOS DERECHOS DEL CONTRATANTE</h3>
<p>3.1. Sin perjuicio de las demás disposiciones de este contrato, constituyen derechos del Contratante:<br>
(i) Efectuar la contraprestación acordada (permuta), de acuerdo con el plazo y las condiciones pactadas, bajo pena de ejecución del presente contrato, conforme a la ley vigente y sus penalidades;<br>
(ii) Incluir demás obligaciones necesarias bajo responsabilidad del Contratante.</p>

<h3 style="font-size:13px;font-weight:700;margin:20px 0 8px;text-transform:uppercase;letter-spacing:.04em">CLÁUSULA 4ª – DE LA RESCISIÓN Y MULTA</h3>
<p>4.1. Este Contrato se resuelve de pleno derecho, independientemente de cualquier formalidad judicial o extrajudicial, únicamente en los casos de infracción de las cláusulas contenidas en este instrumento, excluyéndose los demás motivos explícitos en la Ley.</p>
<p>4.2. El 30% del valor total el valor del producto corresponde a quien rescinda sin motivo sin causa justificada por ambas partes.</p>

<h3 style="font-size:13px;font-weight:700;margin:20px 0 8px;text-transform:uppercase;letter-spacing:.04em">CLÁUSULA 5ª – DE LOS DERECHOS DE IMAGEN</h3>
<p>5.1. El Contratado no otorga al Contratante ni a su cliente la licencia de uso del nombre, voz, firma artística e imagen, en territorio nacional para fines de divulgación del contenido mencionado en el cuadro resumen objeto del contrato, dado que no es su derecho autorizar directamente tal concepto, puesto que el derecho de uso es decidido y utilizado de cualquier forma por el Contratante.</p>

<h3 style="font-size:13px;font-weight:700;margin:20px 0 8px;text-transform:uppercase;letter-spacing:.04em">CLÁUSULA 6ª – PROTECCIÓN DE DATOS Y PRIVACIDAD</h3>
<p>6.1. Las Partes reconocen que, para la prestación de los Servicios al Contratante, el Contratado y/o la Interviniente no necesitan tratar datos personales, siendo lícito que la Ley General de Protección de Datos aplicable y sus modificaciones posteriores pueda o no ser utilizada en contratos que contengan datos personales sensibles y/o no sensibles.</p>

<h3 style="font-size:13px;font-weight:700;margin:20px 0 8px;text-transform:uppercase;letter-spacing:.04em">CLÁUSULA 7ª – DE LAS DISPOSICIONES GENERALES</h3>
<p>7.1. Demás ítems que se consideren importantes para la formalización contractual entre las partes, sin límite de cláusulas.</p>

<h3 style="font-size:13px;font-weight:700;margin:20px 0 8px;text-transform:uppercase;letter-spacing:.04em">CLÁUSULA 8ª – DE LAS FIRMAS Y DEL FUERO</h3>
<p>9.1. Inclusión del texto competente para regular las firmas de las partes y testigos, ya sea de forma digital o presencial.</p>

<div style="margin-top:64px;display:flex;justify-content:space-between;gap:40px">
  <div style="flex:1;text-align:center">
    <div style="height:48px"></div>
    <div style="border-top:1.5px solid #333;padding-top:10px">
      <strong>CONTRATANTE</strong><br>
      <span style="font-size:12px;color:#666">Chan Kong To<br>PR &amp; Influencer Marketing<br>Digituly Comercio LTDA</span>
    </div>
  </div>
  <div style="flex:1;text-align:center">
    <div style="height:48px"></div>
    <div style="border-top:1.5px solid #333;padding-top:10px">
      <strong>CONTRATADO / INFLUENCIADOR(A)</strong><br>
      <span style="font-size:12px;color:#333">{{nombre_firma}}</span>
    </div>
  </div>
</div>

</div>
`.trim();

async function main() {
  console.log('🔌 Connecting to Neon...');
  const brands = await sql`SELECT id, name FROM brands ORDER BY name`;
  console.log(`📦 Found ${brands.length} brands: ${brands.map(b => b.name).join(', ')}`);

  for (const brand of brands) {
    const tplId = 'carta-acuerdo-' + brand.id;
    // Check if already exists
    const existing = await sql`SELECT id FROM contract_templates WHERE id=${tplId}`;
    if (existing.length) {
      console.log(`  ↩  Skipped ${brand.name} (template already exists)`);
      continue;
    }
    await sql`
      INSERT INTO contract_templates (id, brand_id, name, fields, body_html)
      VALUES (
        ${tplId},
        ${brand.id},
        ${'Carta Acuerdo — ' + brand.name},
        ${JSON.stringify(FIELDS)}::jsonb,
        ${BODY_HTML}
      )
    `;
    console.log(`  ✅  Created template for ${brand.name}`);
  }

  console.log('\n🎉 Done! Refresh the dashboard and open any brand to see the Contracts section.');
  process.exit(0);
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
