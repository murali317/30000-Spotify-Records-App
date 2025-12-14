<h1 align="center">Spotify Tracks Table Management App</h1>

## ⚒️ Setup Instructions

1. **Clone the repository**
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Add your dataset:**
   - Place your `spotify_tracks.csv` file in the `public/` directory.
4. **Run the app locally:**
   ```bash
   npm run dev
   ```
5. **Open in browser:**
   - Visit [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal)

---

## 📜 Feature List

- **Table display of Spotify tracks** with sorting, filtering, and pagination
- **Global search** and per-column filters (name, artist, genre)
- **CSV export** (all or selected rows, with correct headers)
- **Bulk actions:**
  - Multi-row selection with checkboxes
  - Pagination-aware select all
  - Export selected rows
  - Delete selected rows
- **Responsive design** for desktop and tablet
- **Loading, error, and empty states**
- **Error boundary** for user-friendly crash handling
- All implemented features respect shorter time constraints (seconds, milliseconds for refreshing, downloading, sorting, searching & pagination...)

---

## ©️ Dataset Choice

**Dataset:** Spotify Tracks CSV

- This is chosen for its real-world relevance, variety of fields (track, artist, album, genre, popularity, etc.), and suitability for demonstrating table features like filtering, sorting, and bulk actions.
- The dataset is easy to parse and large enough to showcase performance and UX features.

---

## 📈 Technology Decisions & Trade-offs

- **React + TypeScript:** Modern, type-safe, and widely adopted for robust UI development.
- **Vite:** Fast dev/build tool for React projects.
- **TanStack Table v8:** Powerful, flexible table logic (sorting, filtering, pagination, selection, resizing, etc.).
- **TailwindCSS:** Utility-first CSS for rapid, responsive, and themeable UI.
- **PapaParse:** Fast CSV parsing and export.
- **Trade-offs:**
  - TanStack Table is more complex than basic table libs, but enables advanced features and performance.
  - Tailwind requires utility class learning, but results in maintainable, scalable styles.
  - No backend: all data is client-side for simplicity and demo purposes.

---

## 🚀 Known Limitations & Future Improvements

- **No persistent storage:** All changes (delete, selection) are in-memory only.
- **No backend integration:** All data is loaded from CSV; no live updates or multi-user support.
- **No undo for delete:** Deleting rows is permanent for the session.
- **No advanced analytics:** Only table-based features are implemented.
- **Accessibility:** Basic ARIA labels are present, but further improvements possible.
- **Column management:** Only resizing is implemented; column reordering and advanced visibility management could be added.
- **Testing:** No automated tests included.

---

## Live Link

https://spotify-track-nirmaan.netlify.app/

---

🔹 **Developer:** Muralikrishna Devarakonda 🧑‍💻
🔹 **Thanks to:** Nirmaan (Stratos Infra MEP firm) 🏢
