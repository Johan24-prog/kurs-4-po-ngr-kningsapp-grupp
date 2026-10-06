# Poängräknare

Poängräknaren är en webbapp för att skapa och hantera poängbaserade spel. Skapa en match, lägg till spelare och följ poängen medan spelet pågår. Matcherna sparas så att de går att öppna igen senare.

<p align="center">
  <img src="./docs/scoreboard-hero.svg" alt="Illustration av poängräknaren med en match och spelarnas poäng" width="100%">
</p>

## Funktioner

- Skapa spel med eget namn och lägg till eller ta bort spelare.
- Ange startpoäng och välj om högst eller lägst poäng ska visas först.
- Ändra poäng med steg om 1 eller ange ett eget poängsteg.
- Lägg till spelare under pågående match, om inställningen är aktiverad.
- Starta om en match för att återställa spelarnas poäng till deras startpoäng.
- Sök bland sparade spel med namn eller spel-id och öppna dem via en egen länk.
- Synka ändringar i realtid mellan användare som har samma match öppen.

## Teknik

- **Frontend:** React, TypeScript, Vite och Tailwind CSS.
- **Backend:** ASP.NET Core Minimal API och Entity Framework Core.
- **Lagring:** SQLite (`scoreboard.db`).
- **Realtid:** SignalR.

## Kom igång lokalt

Du behöver Node.js med npm och .NET 10 SDK.

1. Starta backend från en terminal:

   ```bash
   cd App/backend
   dotnet run
   ```

   Backendens utvecklingsprofil lyssnar på `http://localhost:63276`.

2. Starta frontend från en annan terminal:

   ```bash
   cd App/frontend
   npm install
   npm run dev
   ```

3. Öppna adressen som Vite visar i terminalen (vanligtvis `http://localhost:5173`).

Vite skickar API- och SignalR-anrop vidare till backend på `http://localhost:63276`. Om backend körs på en annan adress kan måladressen ändras med miljövariabeln `VITE_BACKEND_URL`.

## Bygg frontend

Från repositoryts rotmapp kör du:

```bash
npm run build
```

Bygget kontrollerar TypeScript och skapar frontendfilerna i `App/backend/wwwroot`, där ASP.NET Core kan servera dem tillsammans med API:et.
