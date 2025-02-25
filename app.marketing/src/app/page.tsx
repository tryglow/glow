import logoGithub from '@/assets/landing-page/logo-github.svg';
import logoInstagram from '@/assets/landing-page/logo-instagram.svg';
import logoSpotify from '@/assets/landing-page/logo-spotify.svg';
import logoThreads from '@/assets/landing-page/logo-threads.svg';
import logoTiktok from '@/assets/landing-page/logo-tiktok.svg';
import logoX from '@/assets/landing-page/logo-x.svg';
import logoYoutube from '@/assets/landing-page/logo-youtube.svg';
import { LoginWidget } from '@/components/LoginWidget';
import { MarketingContainer } from '@/components/MarketingContainer';
import { FrequentlyAskedQuestions } from '@/components/landing-page/Faq';
import { ShowLoginAlert } from '@/components/landing-page/ShowLoginAlert';
import styles from '@/components/landing-page/styles.module.scss';
import {
  GithubCommitsThisMonthMockup,
  ImageMockup,
  InstagramLatestPostMockup,
  LinkBoxMockup,
  SpotifyPlayingNowMockup,
  StackMockup,
} from '@/components/landing-page/ui-mockups';
import { ArrowRightIcon, ArrowUpRightIcon } from '@heroicons/react/20/solid';
import { Button, cn } from '@tryglow/ui';
import Image from 'next/image';
import Link from 'next/link';

const featuredProfiles: {
  name: string;
  label: string;
  slug: string;
  avatarUrl: string;
  bg: string;
  bgImage?: string;
  isLight?: boolean;
}[] = [
  {
    name: 'Michele Riva',
    label: 'Co-founder and CTO @Orama. TC39 Delegate.',
    slug: 'michele',
    avatarUrl:
      'https://cdn.glow.as/block-606a523c-7c90-4a24-abd7-fe323718b5fd/68d83e15-6fde-4c94-810d-a1485e1af193',
    bg: '#2c2443',
  },

  {
    name: 'Dmitri Tsvetkov',
    label: 'Programmer | Entrepreneur | Founder at graspil.com',
    slug: 'beekboff',
    avatarUrl:
      'https://cdn.glow.as/block-bda8e51a-9566-4fc0-88b8-0110937688b7/3155a632-e053-4c41-9d9e-a4092e98bcaf',
    bg: '#f5f5f4',
    isLight: true,
  },
  {
    name: 'Alex',
    label: 'A product engineer from the UK based in Milan.',
    slug: 'alex',
    avatarUrl:
      'https://cdn.glow.as/block-f5a2d44d-6933-4a51-a9e2-9fbb27923585/f4fdd080-46be-483f-9b04-e5646efb157d',
    bg: '#2c2443',
  },
  {
    name: 'Arjun Sharda',
    label: 'Executive Director @ TLEEM',
    slug: 'arjun',
    avatarUrl:
      'https://cdn.glow.as/block-4cc796c0-018b-46e7-af22-77e3ac421882/32b1a2eb-2a3f-4133-aee2-9b016bc38cc8',
    bg: '#000',
  },
  {
    name: 'Preeti Y.',
    label: "I'm Preeti. Nice to meet you!",
    slug: 'earthpyy',
    avatarUrl:
      'https://cdn.glow.as/block-33c6e82d-8ef3-4c37-92ec-c8fb123e1bc8/59169aa9-6524-400a-bd5e-d7b6d62e965b',
    bg: '#f5f5f4',
    isLight: true,
  },
  {
    name: 'Hystruct',
    label: 'Web scraping made easy',
    slug: 'hystruct',
    avatarUrl:
      'https://cdn.glow.as/block-ebc6bb3e-72c2-45f9-af7d-6137fc99bd47/f606307f-02fc-47fc-b3d4-84e9eba360e2',
    bg: '#000',
  },
  {
    name: 'Jonas K',
    label: 'Wallpapers / Icons / Etsy',
    slug: 'jonask',
    avatarUrl:
      'https://cdn.glow.as/block-db66b09e-6253-477e-b48e-7adc9f5234fa/7c98057e-f2c2-415b-bb8c-638e2a961994',
    bg: '#f5f5f4',
    isLight: true,
  },
  {
    name: 'SK',
    label: 'Probably nothing...',
    slug: 'skl',
    avatarUrl:
      'https://cdn.glow.as/block-65ddb0b7-467c-4015-bd15-2b2ff91a4b73/c7f46beb-7f9b-4034-b734-037cd38bbb34',
    bg: '#000',
    bgImage:
      'https://cdn.glow.as/pg-bg-42175fcd-41b6-4411-a46e-38e8f09352ad/953fee3e-0c78-400b-b195-ff461d0feeb5',
  },
  {
    name: 'Jack',
    label: 'Product designer from Paris.',
    slug: 'jack',
    avatarUrl:
      'https://cdn.glow.as/666b7445-c171-4ad7-a21d-eb1954b7bd40/0885d7ec-9af4-4430-94f4-ad1a033c2704',
    bg: '#f5f5f4',
    isLight: true,
  },
];

const title = ['A', 'delightfully', 'rich', 'link-in-bio.'];

export default async function LandingPage(props: {
  searchParams: Promise<{ force: string }>;
}) {
  const searchParams = await props.searchParams;
  const { force } = searchParams;

  return (
    <div className="min-h-screen overflow-x-hidden">
      <ShowLoginAlert />
      <section className="bg-gradient-to-t from-white to-slate-200 py-8 sm:py-16">
        <MarketingContainer>
          <div className="grid grid-cols-1 md:grid-cols-6 items-center">
            <div className="md:col-span-3 md:pr-10">
              <div
                className={cn(
                  'flex gap-4 items-center mb-4 md:mb-8',
                  styles.socialProof
                )}
              >
                <div className="flex -space-x-1 overflow-hidden">
                  <Image
                    width={28}
                    height={28}
                    className="inline-block h-7 w-7 rounded-full ring-2 ring-[##ebc7e2]"
                    src="https://cdn.glow.as/block-4cc796c0-018b-46e7-af22-77e3ac421882/32b1a2eb-2a3f-4133-aee2-9b016bc38cc8"
                    alt=""
                  />
                  <Image
                    width={28}
                    height={28}
                    className="inline-block h-7 w-7 rounded-full ring-2 ring-[##ebc7e2]"
                    src="https://cdn.glow.as/666b7445-c171-4ad7-a21d-eb1954b7bd40/0885d7ec-9af4-4430-94f4-ad1a033c2704"
                    alt=""
                  />
                  <Image
                    width={28}
                    height={28}
                    className="inline-block h-7 w-7 rounded-full ring-2 ring-[##ebc7e2]"
                    src="https://cdn.glow.as/block-bda8e51a-9566-4fc0-88b8-0110937688b7/3155a632-e053-4c41-9d9e-a4092e98bcaf"
                    alt=""
                  />
                  <Image
                    width={28}
                    height={28}
                    className="inline-block h-7 w-7 rounded-full ring-2 ring-[##ebc7e2]"
                    src="https://cdn.glow.as/block-9077b37e-2c6c-4457-aa30-13f44f38ec15/76af84b5-0e47-41fc-852b-458020c75d71"
                    alt=""
                  />
                </div>
                <span className="text-xs font-medium text-slate-500 block">
                  Trusted by 1000+ creators
                </span>
              </div>
              <h1
                className={cn(
                  'text-5xl lg:text-6xl font-black text-black tracking-tight',
                  styles.title
                )}
              >
                {title.map((word) => {
                  return (
                    <span
                      key={word}
                      className={
                        ['link-in-bio.'].includes(word)
                          ? 'bg-clip-text text-transparent bg-[linear-gradient(to_right,theme(colors.amber.500),theme(colors.pink.500))]'
                          : 'text-[#241f3d]'
                      }
                    >
                      {word}
                    </span>
                  );
                })}
              </h1>
              <span
                className={cn(
                  'text-xl md:text-[1.4rem] font-normal mt-3 md:mt-4 block text-[#241f3d]/80 text-pretty',
                  styles.subtitle
                )}
              >
                Glow is the open source link-in-bio that integrates with your
                favorite platforms to keep your page fresh, so that you can
                focus on creating.
              </span>

              <div
                className={cn(
                  'mt-4 md:mt-8 flex flex-col items-start w-full',
                  styles.ctas
                )}
              >
                <div className="w-full md:w-auto inline-flex flex-row items-center rounded-full bg-white pl-4 border border-slate-200 shadow-sm">
                  <span className="text-slate-600 font-medium">glow.as/</span>
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
                <Button variant="link" asChild>
                  <Link
                    href="/jack"
                    target="_blank"
                    className="text-slate-500 text-xs font-medium text-left pl-0"
                  >
                    See an example page →
                  </Link>
                </Button>
              </div>
            </div>
            <div className="mt-8 md:mt-0 md:col-span-3">
              <div className="md:rotate-6 grid grid-cols-10 grid-rows-16 gap-3 w-full md:-right-8 lg:-right-16 relative">
                <div className="col-span-10 md:col-span-5 flex flex-col gap-3">
                  <SpotifyPlayingNowMockup
                    className={cn('col-span-5', styles.block1)}
                  />
                  <GithubCommitsThisMonthMockup
                    className={cn('col-span-5 md:col-span-4', styles.block6)}
                  />
                </div>
                <StackMockup className={cn('col-span-5', styles.block7)} />
                <ImageMockup
                  className={cn(
                    'col-span-5 md:col-span-10 min-h-[140px]  ',
                    styles.block4
                  )}
                />
                <InstagramLatestPostMockup
                  className={cn(
                    'col-span-10 min-h-[160px] md:min-h-[200px] md:col-span-5',
                    styles.block5
                  )}
                />
                <div className="col-span-10 md:col-span-5 flex flex-col gap-3">
                  <LinkBoxMockup className={styles.block2} variant="x" />
                  <LinkBoxMockup
                    className={styles.block5}
                    variant="instagram"
                  />
                  <LinkBoxMockup className={styles.block3} variant="linkedin" />
                </div>
              </div>
            </div>
          </div>
        </MarketingContainer>
      </section>

      <section className="my-20 md:mt-24 md:mb-48">
        <MarketingContainer>
          <h2 className="text-3xl font-black tracking-tight text-center mb-2">
            Integrates with your favorite platforms
          </h2>
          <p className="text-base md:text-lg text-pretty mb-10 text-center">
            Show live follower stats, photos, videos and more.
          </p>

          <div className="flex flex-wrap gap-8 md:gap-14 justify-center items-center">
            <img
              src={logoYoutube.src}
              alt="YouTube logo"
              className="max-w-[100px] max-h-6"
            />
            <img
              src={logoX.src}
              alt="X logo"
              className="max-w-[100px] max-h-6"
            />
            <img
              src={logoGithub.src}
              alt="GitHub logo"
              className="max-w-[100px] max-h-6"
            />
            <img
              src={logoInstagram.src}
              alt="Instagram logo"
              className="max-w-[100px] max-h-6"
            />
            <img
              src={logoSpotify.src}
              alt="Spotify logo"
              className="max-w-[100px] max-h-6"
            />
            <img
              src={logoThreads.src}
              alt="Threads logo"
              className="max-w-[100px] max-h-6"
            />
            <img
              src={logoTiktok.src}
              alt="TikTok logo"
              className="max-w-[100px] max-h-6"
            />
          </div>
        </MarketingContainer>
      </section>

      <section className="my-20">
        <MarketingContainer>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-2">
            The ultimate link-in-bio
          </h2>
          <p className="text-base md:text-lg text-pretty">
            Use our drag-and-drop builder to create your page.
          </p>
          <div className="mt-8 md:mt-16 sm:h-auto relative w-full h-full [--radius:theme(borderRadius.xl)]">
            <div className="absolute -inset-[var(--padding)] rounded-[calc(var(--radius)+var(--padding))] shadow-sm ring-1 ring-black/5 [--padding:theme(spacing.2)]"></div>
            <video
              autoPlay
              muted
              loop
              playsInline
              className="h-full rounded-[var(--radius)] w-full shadow-2xl ring-1 ring-black/10"
            >
              <source
                src="/i/assets/landing-page/landing-page-demo.mp4"
                type="video/mp4"
              />
            </video>
          </div>
        </MarketingContainer>
      </section>

      <section className="my-20 md:my-32">
        <MarketingContainer>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-8">
            What makes Glow special?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 w-full">
            <div className="w-full bg-[#e2e5ea] bg-gradient-to-tr from-[#607166] to-[#87a290] border border-stone-200 md:row-span-2 overflow-hidden rounded-xl flex flex-col justify-between">
              <Image
                src="/i/assets/landing-page/dynamic.png"
                width={789}
                height={1311}
                className="w-full border-b border-stone-100"
                alt=""
              />
              <div className="py-3 px-4 bg-white flex-1 flex flex-col justify-center">
                <h3 className="text-lg font-black tracking-tight mb-1">
                  Dynamic
                </h3>
                <p className="text-base text-black/80">
                  Glow does the hard work for you, fetching all of the latest
                  content to keep your page fresh.
                </p>
              </div>
            </div>
            <div className="w-full bg-gradient-to-tr from-[#4e54c8] to-[#8f94fb] border border-stone-200 overflow-hidden rounded-xl flex flex-col justify-between md:col-span-2">
              <Image
                src="/i/assets/landing-page/drag.png"
                width={789}
                height={294}
                className="w-full border-b border-stone-100"
                alt=""
              />
              <div className="py-3 px-4 bg-white flex-1 flex flex-col justify-center">
                <h3 className="text-lg font-black tracking-tight mb-1">
                  Drag & drop
                </h3>
                <p className="text-base text-black/80">
                  Build your page block by block in minutes.
                </p>
              </div>
            </div>
            <div className="w-full bg-gradient-to-tr from-[#fc4a1a] to-[#f7b733] border border-stone-200 overflow-hidden rounded-xl flex flex-col justify-between">
              <Image
                width={789}
                height={479}
                src="/i/assets/landing-page/themes.png"
                className="w-full border-b border-stone-100"
                alt=""
              />
              <div className="py-3 px-4 bg-white flex-1 flex flex-col justify-center">
                <h3 className="text-lg font-black tracking-tight mb-1">
                  Customizable
                </h3>
                <p className="text-base text-black/80">
                  With a few clicks, you can customize the look and feel of your
                  page.
                </p>
              </div>
            </div>
            <div className="w-full  bg-gradient-to-tr from-[#282337] to-[#434665] border border-stone-200 overflow-hidden rounded-xl flex flex-col justify-between">
              <Image
                width={789}
                height={479}
                src="/i/assets/landing-page/devices.png"
                className="w-full border-b border-stone-100"
                alt=""
              />
              <div className="py-3 px-4 bg-white flex-1 flex flex-col justify-center">
                <h3 className="text-lg font-black tracking-tight mb-1">
                  Works everywhere
                </h3>
                <p className="text-base text-black/80">
                  Your page will look great on mobile and desktop.
                </p>
              </div>
            </div>
          </div>
        </MarketingContainer>
      </section>

      <section className="my-20">
        <MarketingContainer>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-2">
            Explore
          </h2>
          <Link
            href="/i/explore"
            className="inline-block text-base text-slate-600 mb-8"
          >
            View all →
          </Link>

          <div className="w-screen overflow-x-auto no-scrollbar ml-[calc(((100vw_-_100%)_/_2)_*_-1)] pl-[calc((100vw_-_100%)_/_2)] -mt-8">
            <div className="w-auto flex gap-4 py-8">
              {featuredProfiles.map((profile) => {
                return (
                  <Link
                    href={profile.slug}
                    key={profile.slug}
                    className="group z-20 relative"
                  >
                    <div
                      className={`border border-black/10 rounded-xl w-[270px] h-[180px] px-5 py-6 shadow-sm group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-200 ease-in-out bg-cover`}
                      style={{
                        backgroundColor: profile.bg,
                        backgroundImage: `url(${profile.bgImage})`,
                      }}
                    >
                      <ArrowUpRightIcon
                        className={cn(
                          'absolute top-2 right-2 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out',
                          profile.isLight
                            ? 'text-stone-800/20'
                            : 'text-white/20'
                        )}
                      />
                      <div className="flex flex-col">
                        <Image
                          src={profile.avatarUrl}
                          width={56}
                          height={56}
                          className={cn(
                            'w-14 h-14 rounded-lg outline outline-3',
                            profile.isLight
                              ? 'outline-stone-200'
                              : 'outline-white/10'
                          )}
                          alt=""
                        />
                        <span
                          className={cn(
                            'font-bold text-lg mt-2 ',
                            profile.isLight ? 'text-stone-900' : 'text-white'
                          )}
                        >
                          {profile.name}
                        </span>
                        <span
                          className={cn(
                            'font-normal text-sm',
                            profile.isLight ? 'text-stone-700' : 'text-white/70'
                          )}
                        >
                          {profile.label}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </MarketingContainer>
      </section>

      <section className="my-24 ">
        <MarketingContainer>
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-10">
            <div className="w-full px-8 py-8 md:py-16 bg-gradient-to-tr from-[#4e54c8] to-[#8f94fb] rounded-xl">
              <SpotifyPlayingNowMockup
                className="!border-black/10"
                variant="kites"
              />
            </div>
            <div className="flex flex-col items-start gap-2">
              <span className="text-xs font-bold uppercase bg-yellow-300 text-yellow-900 px-2 py-1 rounded-full">
                New
              </span>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight">
                Share what you&apos;re listening to
              </h2>
              <p className="text-base md:text-lg text-pretty">
                With live blocks, you can share things like what you&apos;re
                currently listening to on Spotify, or your latest Instagram
                post.
              </p>
            </div>
          </div>
        </MarketingContainer>
      </section>

      <section className="my-24">
        <MarketingContainer>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">
              Frequently Asked <br /> Questions
            </h2>
            <div className="flex flex-col items-start w-full flex-1 gap-4">
              <FrequentlyAskedQuestions />
              <Link href="/i/learn" className="text-sm text-slate-600">
                View more →
              </Link>
            </div>
          </div>
        </MarketingContainer>
      </section>

      <section className="py-8 md:py-24">
        <MarketingContainer>
          <div className="bg-[#e2e5ea] rounded-xl overflow-hidden">
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
                    <span className="text-slate-600 font-medium">glow.as/</span>
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
              <Image
                width={831}
                height={831}
                src="/i/assets/landing-page/blocks.webp"
                className="hidden md:block flex-1 h-full w-full object-cover"
                alt=""
              />
            </div>
          </div>
        </MarketingContainer>
      </section>

      <style>
        {`:root {
          --color-sys-bg-base: 60deg 4.760000000000001% 96%;
          --color-sys-bg-primary: 0deg 0% 100%;
          --color-sys-bg-secondary: 0deg 0% 90.2%;
          --color-sys-bg-border: 0deg 0% 84.73%;
          
          --color-sys-label-primary: 240deg 3.45% 11.37%;
          --color-sys-label-secondary: 0deg 0% 16%;
          }`}
      </style>
    </div>
  );
}
