/**
 * ContactHeader Component
 *
 * Header section for the contact page using SectionHeader
 */

import { SectionHeader } from "@/components/ui/section-header";

interface ContactHeaderProps {
  title: string;
  titleHighlight: string;
  description: string;
}

export function ContactHeader({
  title,
  titleHighlight,
  description,
}: ContactHeaderProps) {
  return (
    <SectionHeader
      title={title}
      titleHighlight={titleHighlight}
      description={description}
      align="center"
    />
  );
}
