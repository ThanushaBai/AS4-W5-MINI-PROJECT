"use client";

interface Props {
  message: string;
  show: boolean;
}

export default function Toast({ message, show }: Props) {
  if (!show) return null;

  return (
    <div className="fixed top-5 right-5 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg animate-bounce z-50">
      {message}
    </div>
  );
}