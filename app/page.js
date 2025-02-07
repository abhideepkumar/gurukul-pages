export const runtime = "edge";
import PaymentsHistory from "@/components/payments";
import Link from "next/link";

export default function Home() {
  return (
    <main className="py-5">
      <div className="flex flex-row justify-evenly mb-5">
        <Link
          href="/deposit"
          className="inline-flex items-center gap-2 border-2 border-emerald-600 bg-green-100 hover:bg-green-200 rounded-md px-4 py-2 text-xl"
        >
          Deposit Money
        </Link>
        <Link
          href="/withdraw"
          className="inline-flex items-center gap-2 border-2 border-rose-600 bg-rose-100 hover:bg-rose-200 rounded-md px-4 py-2 text-xl"
        >
          Withdraw Money
        </Link>
      </div>
      <div>
        <PaymentsHistory />
      </div>
    </main>
  );
}
