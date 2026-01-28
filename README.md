## Finboard

Finboard is a Next.js finance dashboard that lets you create live widgets from any JSON API. Test endpoints, map fields into cards, tables, or charts, and rearrange everything with drag-and-drop. State persists in the browser so dashboards survive refreshes.

### Why it’s useful
- Build custom finance views without hardcoding; point widgets to any API.
- Card, table, and line-chart widgets with search, pagination, and live updates.
- Drag-and-drop layout powered by dnd-kit; state persisted via Zustand.
- API tester with JSON explorer to map fields visually before saving.
- Finnhub support out of the box (auto-injects `NEXT_PUBLIC_FINNHUB_API_KEY`).

### Quick start
Prerequisites: Node 18+ and npm.

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

### Configure APIs
- Create `.env.local` with your Finnhub token (optional but recommended):

```bash
NEXT_PUBLIC_FINNHUB_API_KEY=your_token_here
```

- Any widget endpoint can be a full URL. Finnhub-specific endpoints are auto-signed if the token is set.

### Using the dashboard
1) Click **Add Widget**.
2) Enter a title and choose **CARD**, **TABLE**, or **CHART**.
3) Paste an API endpoint and hit **Test API** to fetch sample data.
4) In the JSON explorer, click fields to map them into the widget.
5) Set a refresh interval and **Create Widget**. Drag to reorder; use the close icon to remove.

Example endpoints to try:
- Quote: `https://finnhub.io/api/v1/quote?symbol=AAPL`
- Peers (renders a table): `https://finnhub.io/api/v1/stock/peers?symbol=AAPL`
- Candles (renders a chart): `https://finnhub.io/api/v1/quote?symbol=AAPL` 
        (Select c)

### Available scripts
- `npm run dev` – start the dev server
- `npm run build` – create a production build
- `npm start` – run the production server
- `npm run lint` – lint with ESLint

### Architecture highlights
- Next.js App Router with React 19 and Tailwind CSS 4.
- React Query handles fetching and background refresh intervals (see [src/lib/react-query.ts](src/lib/react-query.ts)).
- Widgets and layout are persisted in localStorage via Zustand (see [src/store/index.ts](src/store/index.ts)).
- Widget types: cards ([src/components/widgets/CardWidget.tsx](src/components/widgets/CardWidget.tsx)), tables ([src/components/widgets/TableWidget.tsx](src/components/widgets/TableWidget.tsx)), and charts ([src/components/widgets/ChartWidget.tsx](src/components/widgets/ChartWidget.tsx)).
- Widget Builder tests endpoints and maps JSON fields before saving (see [src/components/widgets/WidgetBuilder.tsx](src/components/widgets/WidgetBuilder.tsx)).

### Getting help
- Open an issue in this repository.
- Check `npm run lint` / `npm run build` output for local diagnostics.

### Contributing
Pull requests are welcome. Please open an issue first if you plan significant changes.

### Maintainers
- Mayankax (repo owner)

### License
License file not provided yet. Please confirm terms before production use.
