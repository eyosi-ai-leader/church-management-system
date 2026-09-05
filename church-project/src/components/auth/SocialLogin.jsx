export default function SocialLogin() {
  return (
    <div className="grid grid-cols-2 gap-3">

      <button
        type="button"
        className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
      >
        <span className="font-bold text-red-500">G</span>
        Google
      </button>

      {/* <button
        type="button"
        className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
      >
        <span className="font-bold text-slate-900">GH</span>
        GitHub
      </button> */}

    </div>
  );
}