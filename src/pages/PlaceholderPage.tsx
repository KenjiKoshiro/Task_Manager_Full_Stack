import { Link } from 'react-router-dom';

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export default function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <section className="rounded-2xl border border-[#424754]/10 bg-[#201f1f] p-8 md:p-12">
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-[#adc6ff]">In Progress</p>
      <h2 className="mb-4 text-3xl font-black tracking-tight text-[#e5e2e1]">{title}</h2>
      <p className="max-w-2xl text-sm leading-7 text-[#c2c6d6]">{description}</p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          to="/tasks"
          className="rounded-lg bg-[#adc6ff]/10 px-4 py-3 text-sm font-medium text-[#adc6ff] transition-colors hover:bg-[#adc6ff]/20"
        >
          Open Task Board
        </Link>
        <Link
          to="/dashboard"
          className="rounded-lg border border-[#424754]/30 px-4 py-3 text-sm font-medium text-[#e5e2e1] transition-colors hover:border-[#adc6ff]/40 hover:text-[#adc6ff]"
        >
          Back to Dashboard
        </Link>
      </div>
    </section>
  );
}
