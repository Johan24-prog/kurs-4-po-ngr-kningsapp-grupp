# Poängräknare

En webbapp för att skapa poängbaserade spel, hantera spelare och hålla koll på ställningen. Spel sparas så att de kan öppnas igen, och poängändringar synkas i realtid mellan användare som tittar på samma match.

<p align="center">
  <img src="App/frontend/docs/scoreboard-hero.svg" alt="Illustration av poängräknaren med en match och spelarnas poäng" width="100%">
</p>

## Funktioner

- Skapa matcher med eget namn, spelare och startpoäng.
- Öka eller minska poäng med standardsteg eller ett eget steg.
- Sortera spelare efter högsta eller lägsta poäng.
- Välj om spelare får läggas till under en pågående match.
- Starta om matchen och återställ poängen.
- Sök efter sparade spel via namn eller spel-id.
- Synka matchändringar i realtid med SignalR.

## Teknik

- **Frontend:** React, TypeScript, Vite och Tailwind CSS.
- **Backend:** ASP.NET Core Minimal API och Entity Framework Core.
- **Databas:** SQLite.
- **Realtid:** SignalR.

## Kom igång

Du behöver Node.js med npm och .NET 10 SDK.

Starta backend i en terminal:

```bash
cd App/backend
dotnet run
```

Starta frontend i en annan terminal:

```bash
cd App/frontend
npm install
npm run dev
```

Öppna adressen som Vite visar i terminalen (vanligtvis `http://localhost:5173`). Vite skickar API- och SignalR-anrop vidare till backend på `http://localhost:63276`.

Från repositoryts rotmapp kan du bygga frontendfilerna till `App/backend/wwwroot` med:

```bash
npm run build
```

Se [frontendens README](App/frontend/README.md) för mer information.
