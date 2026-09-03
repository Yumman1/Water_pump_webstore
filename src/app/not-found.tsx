import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { Logo } from "@/components/store/Logo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <Logo className="mb-8 justify-center" />
      <p className="text-6xl font-extrabold text-brand-600">404</p>
      <h1 className="mt-4 text-2xl font-bold text-gray-900">Page not found</h1>
      <p className="mt-2 text-gray-500">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
      <div className="mt-6 flex gap-3">
        <ButtonLink href="/">Back to Home</ButtonLink>
        <Link href="/shop" className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">
          Browse Shop
        </Link>
      </div>
    </div>
  );
}
