'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const questions = [
  {
    question: 'What is Glow?',
    answer:
      "Glow is a single link that you can use to house all the links to your social media profiles, websites, and other content. It's a great way to share all your content in one place, whether it be your favourite songs on Spotify, or a link to your latest products.",
  },
  {
    question: 'What does link in bio mean?',
    answer:
      "A link in bio is a single link that you can use to house all of the links that you want to share with your audience. Whether you're a creator sharing links to your social media profiles, or a business sharing links to your products and services, a link in bio is a great way to share all your content in one place.",
  },
  {
    question: 'Why do I need Glow?',
    answer:
      'Glow is a singular link solution designed to bridge your audience to every aspect of your digital presence—encompassing who you are, what you do, and what matters to you. It simplifies the sharing process by consolidating multiple links into one, ensuring that your followers, visitors, and customers can effortlessly access all they need in a single location.',
  },
  {
    question: 'Is it free?',
    answer:
      'Yes. Creating a page is free. In the future we might offer premium blocks, however creating a page for personal use will always be free.',
  },
  {
    question: 'Can I use my own domain?',
    answer:
      "We're currently rolling out custom domains to a select group of users. If you're interested in trying it out, please reach out to us.",
  },
];

const generateFaqJsonLd = (
  faqs: {
    question: string;
    answer: string;
  }[]
) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq, index) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
};

export function FrequentlyAskedQuestions() {
  const faqJsonLd = generateFaqJsonLd(questions);

  return (
    <>
      <Accordion type="single" collapsible>
        {questions.map((question) => {
          return (
            <AccordionItem key={question.question} value={question.question}>
              <AccordionTrigger className="text-lg font-medium">
                {question.question}
              </AccordionTrigger>
              <AccordionContent className="text-lg text-black/60">
                {question.answer}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd),
        }}
      />
    </>
  );
}
