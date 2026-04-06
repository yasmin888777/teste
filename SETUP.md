# Como configurar o projeto em um novo computador

## 1. Instale o Git
https://git-scm.com → Download → instale com opções padrão.

## 2. Instale o Node.js
https://nodejs.org → versão LTS → instale.

## 3. Clone o projeto
Abra o terminal e rode:
```bash
git clone https://github.com/yasmin888777/teste.git
cd teste
npm install
```

## 4. Crie o arquivo `.env`
Dentro da pasta `teste`, crie um arquivo chamado `.env` com:
```
DATABASE_URL=<string de conexão do Neon>
JWT_SECRET=<jwt secret>
```
> Encontre esses valores em: **Render** → seu serviço → aba **Environment**

## 5. Rode o projeto localmente
```bash
node server.js
```
Acesse: http://localhost:3000

## 6. Abra o Claude Code na pasta
```bash
claude
```

## Para salvar alterações
```bash
git add .
git commit -m "descricao"
git push
```

## Resumo
| O que | Onde fica |
|---|---|
| Código | GitHub (sincronizado) |
| Banco de dados | Neon (nuvem) |
| Site publicado | Render (auto-deploy) |
| Variáveis secretas | `.env` local + Render Environment |
