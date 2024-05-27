"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import { Routes } from "../../routes";
import Head from "next/head";

interface BreadcrumbItem {
	label: string;
	url: string;
	isLast: boolean;
}

const generateBreadcrumbs = (): BreadcrumbItem[] => {
	const pathname = usePathname();
	const segments = pathname?.split("/").filter((segment) => segment !== "");

	const breadcrumbs =
		segments?.map((segment, index) => {
			const url = `/${segments.slice(0, index + 1).join("/")}`;
			return { label: segment, url, isLast: index === segments.length - 1 };
		}) || [];

	return [
		{
			label: "Home",
			url: Routes.home.path(),
			isLast: breadcrumbs.length === 0,
		},
		...breadcrumbs,
	];
};

const generateBreadcrumbJsonLd = (breadcrumbs: BreadcrumbItem[]) => {
	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: breadcrumbs.map((breadcrumb, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: breadcrumb.label,
			item: breadcrumb.url,
		})),
	};
};

export const Breadcrumb = () => {
	const breadcrumbs: BreadcrumbItem[] = generateBreadcrumbs();
	const breadcrumbJsonLd = generateBreadcrumbJsonLd(breadcrumbs);

	return (
		<>
			<Head>
				<script
					type="application/ld+json"
					// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
					dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
				/>
			</Head>
			<div
				className="flex space-x-1 text-seo-500 text-1618 my-4"
				aria-label="breadcrumb"
			>
				{breadcrumbs.map(({ label, url, isLast }) => (
					<Fragment key={url}>
						<Link
							href={url}
							className={isLast ? "font-bold text-seo-600" : ""}
							title={label}
							onClick={isLast ? (e) => e.preventDefault() : undefined}
						>
							{label}
						</Link>
						{!isLast && <span>/</span>}
					</Fragment>
				))}
			</div>
		</>
	);
};
