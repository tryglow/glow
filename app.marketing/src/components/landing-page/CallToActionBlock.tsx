import styles from './call-to-action-block.module.css';
import { LoginWidget } from '@/components/login-widget';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import { Button, cn } from '@trylinky/ui';

const colors = [
  'bg-slate-100',
  'bg-slate-200',
  'bg-slate-300',
  'bg-slate-400',
  'bg-slate-500',
  'bg-slate-600',
  'bg-slate-700',
  'bg-slate-800',
];

function ScrollingColumn({
  delay,
  reverse,
}: {
  delay: number;
  reverse?: boolean;
}) {
  return (
    <div
      className={cn(
        'flex flex-col h-auto min-h-[3000px] gap-2',
        reverse ? styles.animateScrollReverse : styles.animateScroll
      )}
    >
      {[...Array(6)].map((_, i) => {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        return (
          <div className={cn('w-[90px] h-[208px] rounded-xl', randomColor)} />
        );
      })}
    </div>
  );
}

export function CallToActionBlock() {
  return (
    <div className="bg-[#fff] rounded-xl overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8">
        <div className="flex-1 flex flex-col gap-2 col-span-1 max-w-md py-8 md:py-16 px-8">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight">
            Let&apos;s build your page
          </h2>
          <p className="text-base md:text-xl">
            Creating your first page and getting it live takes a matter of
            minutes. Let&apos;s start with your username.
          </p>

          <div className="mt-6">
            <div className="w-full md:w-auto inline-flex flex-row items-center rounded-full bg-white pl-4 border border-slate-200 shadow-sm">
              <span className="text-slate-600 font-medium">lin.ky/</span>
              <input
                type="text"
                placeholder="name"
                className="bg-transparent border-0 px-0 focus:outline-none focus:ring-0 rounded-full w-full"
              />
              <LoginWidget
                isSignup
                trigger={
                  <Button
                    variant="default"
                    size="xl"
                    className="font-bold flex group rounded-full px-6 md:px-10"
                  >
                    Claim Page
                    <ArrowRightIcon className="w-5 h-5 ml-2 -mr-6 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:-mr-4 transition-all ease-in-out duration-200" />
                  </Button>
                }
              />
            </div>
          </div>
        </div>
        <div className="flex-1 w-full h-[600px] relative overflow-hidden">
          <div className="absolute inset-0 -left-28 -top-28 flex gap-2 rotate-45">
            <ScrollingColumn delay={0} />
            <ScrollingColumn delay={1} reverse />
            <ScrollingColumn delay={2} />
            <ScrollingColumn delay={3} reverse />
            <ScrollingColumn delay={4} />
            <ScrollingColumn delay={5} reverse />
            <ScrollingColumn delay={6} />
            <ScrollingColumn delay={7} reverse />
          </div>
        </div>
      </div>
    </div>
  );
}
