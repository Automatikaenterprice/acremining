# AcreMining Landing Page

Landing page React/Vite para AcreMining.

## Requisitos

- Node.js 20 o superior
- npm

## Instalación local

```bash
npm install
npm run dev
```

La app queda disponible en:

```text
http://localhost:28101
```

## Build de producción

```bash
npm run build
```

La carpeta generada será:

```text
dist/
```

## Subir a GitHub desde Olimpo

```bash
mkdir -p /home/hector1617/olimpo/acremining
cd /home/hector1617/olimpo/acremining
# Copiar aquí los archivos del ZIP descomprimido
git init
git remote remove origin 2>/dev/null || true
git remote add origin git@github.com:Automatikaenterprice/acremining.git
git branch -M main
git add .
git commit -m "Initial landing page AcreMining"
git push -u origin main
```

## Contacto

Correo público sugerido: contacto@acremining.cl
