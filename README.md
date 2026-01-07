# ppaw_front

Aplicație frontend pentru convertorul de imagini.

## Cerințe de sistem

- **Node.js** (versiunea 18 sau mai nouă)
- **npm** (gestionar de pachete)

## Pași pentru configurare și lansare

### 1. Clonare repository

```bash
git clone https://github.com/Arekuso-kun/ppaw_front.git
cd ppaw_front
```

### 2. Instalare dependințe

```bash
npm install
```

### 3. Configurare variabile de mediu

Creați un fișier `.env` în directorul rădăcină al proiectului și adăugați următoarea configurație:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

### 4. Lansare în modul dezvoltare

Pentru a porni serverul de dezvoltare:

```bash
npm run dev
```

Aplicația va fi disponibilă la adresa: `http://localhost:5173` (portul implicit pentru Vite)

### 5. Build pentru producție

Pentru a crea o versiune optimizată pentru producție:

```bash
npm run build
```

Fișierele compilate vor fi generate în directorul `dist/`.

### 6. Preview build de producție (opțional)

Pentru a previzualiza build-ul de producție local:

```bash
npm run preview
```

## Tehnologii utilizate

- **React** 19.2.0
- **TypeScript** 5.9.3
- **Vite** 7.2.4
- **Material-UI** 7.3.5
- **TailwindCSS** 3.4.18
- **React Router** 7.9.6
