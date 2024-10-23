'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export function FrquentlyAskedQuestions() {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="what-is-glow">
        <AccordionTrigger className="text-lg font-medium">
          What is Glow?
        </AccordionTrigger>
        <AccordionContent className="text-lg text-black/60">
          Glow is a single link that you can use to house all the links to your
          social media profiles, websites, and other content. It&apos;s a great
          way to share all your content in one place, whether it be your
          favourite songs on Spotify, or a link to your latest products.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="what-is-link-in-bio">
        <AccordionTrigger className="text-lg font-medium">
          What does link in bio mean?
        </AccordionTrigger>
        <AccordionContent className="text-lg text-black/60">
          A link in bio is a single link that you can use to house all of the
          links that you want to share with your audience. Whether you&apos;re a
          creator sharing links to your social media profiles, or a business
          sharing links to your products and services, a link in bio is a great
          way to share all your content in one place.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="why-do-i-need-it">
        <AccordionTrigger className="text-lg font-medium">
          Why do I need Glow?
        </AccordionTrigger>
        <AccordionContent className="text-lg text-black/60">
          Glow is a singular link solution designed to bridge your audience to
          every aspect of your digital presence—encompassing who you are, what
          you do, and what matters to you. It simplifies the sharing process by
          consolidating multiple links into one, ensuring that your followers,
          visitors, and customers can effortlessly access all they need in a
          single location.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="is-it-free">
        <AccordionTrigger className="text-lg font-medium">
          Is it free?
        </AccordionTrigger>
        <AccordionContent className="text-lg text-black/60">
          Yes. Creating a page is free. In the future we might offer premium
          blocks, however creating a page for personal use will always be free.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="can-i-use-my-own-domain">
        <AccordionTrigger className="text-lg font-medium">
          Can I use my own domain?
        </AccordionTrigger>
        <AccordionContent className="text-lg text-black/60">
          We&apos;re currently rolling out custom domains to a select group of
          users. If you&apos;re interested in trying it out, please reach out to
          us.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
