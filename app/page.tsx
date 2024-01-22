import { Button } from '@/components/ui/button';
import MarketingNavigation from './components/MarketingNavigation';
import { LoginWidget } from './components/LoginWidget';
import MarketingFooter from './components/MarketingFooter';

export default function LandingPage() {
  return (
    <>
      <MarketingNavigation />
      <main>
        <section className="py-24 md:py-48">
          <div className="container mx-auto px-4 flex flex-col justify-center items-center">
            <div className="flex flex-col justify-center md:items-center max-w-4xl text-left md:text-center">
              <h1 className="text-2xl md:text-6xl font-medium">
                Always Current, Uniquely You. <br />
                The Dynamic Link in Bio.
              </h1>
              <span className="text-lg md:text-xl font-normal mt-3">
                Onedash is the link in bio that stays up-to-date with your
                content.
              </span>

              <LoginWidget
                trigger={
                  <Button size="xl" className="mt-5">
                    Get started
                  </Button>
                }
              />
            </div>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </>
  );
}
