// components/ui/Breadcrumb.tsx
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
    return (
        <nav className="flex items-center text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-black transition-colors">
                Home
            </Link>
            {items.map((item, index) => (
                <div key={index} className="flex items-center">
                    <ChevronRight className="w-4 h-4 mx-2" />
                    {item.href ? (
                        <Link href={item.href} className="hover:text-black transition-colors">
                            {item.label}
                        </Link>
                    ) : (
                        <span className="font-medium text-black">{item.label}</span>
                    )}
                </div>
            ))}
        </nav>
    );
}
