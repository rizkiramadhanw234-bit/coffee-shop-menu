"use client";

import { FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function HistoryPage() {
  const router = useRouter();

  return (
    <>
      <div
        className="absolute top-0 rounded-full p-2 bg-black m-3"
        onClick={() => router.push("/menu")}
      >
        <FaArrowLeft className="text-white text-sm" />
      </div>

      <h1 className="font-bold text-center mt-4">History</h1>

      {/* content */}
      <div className="pt-5 px-2">
        <div>content</div>
      </div>
    </>
  );
}
