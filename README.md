# Portfólio · Lucas Campos Queiroz

Site estático: `index.html` + `styles.css` + `assets/`. Não tem build nem dependências.

## Ver localmente

```bash
cd ~/Documents/portfolio-lucas
python3 -m http.server 8080
# abrir http://localhost:8080
```

## Antes de publicar

- [ ] Colocar a foto em `assets/photo.jpg` (quadrada, de 600×600 px para cima). Sem a foto, aparecem as iniciais "LQ".
- [ ] Preencher o caso **Scrum Master (FACENS)**. Hoje o bloco amarelo está marcado como rascunho.
- [ ] Revisar os números dos casos. Tudo que é gráfico está como "illustrative".
- [ ] Conferir que não há nome de cliente, colega ou valor de contrato.

## Publicar no GitHub Pages (grátis)

1. Criar uma conta em https://github.com.
2. Criar um repositório **público** chamado `SEU-USUARIO.github.io`. Com esse nome, o site fica na raiz do endereço.
3. No terminal:

```bash
cd ~/Documents/portfolio-lucas
git init
git add .
git commit -m "Primeira versão do portfólio"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/SEU-USUARIO.github.io.git
git push -u origin main
```

4. No GitHub, abrir o repositório → **Settings → Pages** → Source: `Deploy from a branch` → Branch `main` / `/ (root)` → Save.
5. Em 1 ou 2 minutos o site está em `https://SEU-USUARIO.github.io`.

Para atualizar depois: `git add . && git commit -m "ajuste" && git push`.

## Domínio próprio (opcional)

1. Registrar em https://registro.br (ex.: `lucasqueiroz.com.br`, cerca de R$ 40/ano).
2. No GitHub: **Settings → Pages → Custom domain**, digitar o domínio e salvar.
3. No Registro.br, editar o DNS do domínio:
   - 4 registros `A` para `@`: 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153
   - 1 registro `CNAME` para `www` → `SEU-USUARIO.github.io`
4. Quando o DNS propagar, marcar **Enforce HTTPS** no GitHub.

## Alternativa sem git

Arrastar a pasta em https://app.netlify.com/drop. O site sai na hora, num endereço `.netlify.app`.
