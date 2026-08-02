import Approved from '@/components/home/approved';
import BrandPartner from '@/components/home/brand-partner';
import Hero from '@/components/home/hero';
import OurAchievements from '@/components/home/our-achievements';
import Products from '@/components/home/products';
import SeoHead from '@/components/seo-head';
import FrontendLayout from '@/layouts/frontend-layout';
import type {
    Achievement,
    DownloadableItem,
    Hero as HeroModel,
    OurPartner,
} from '@/types';

interface Props {
    heros: HeroModel[];
    products: DownloadableItem[];
    achievements: Achievement[];
    ourPartners: OurPartner[];
    approveds: DownloadableItem[];
}

/** Hero and partner images live in `public/`, so they only need a leading slash. */
function publicAsset(path: string): string {
    return path.startsWith('/') ? path : `/${path}`;
}

export default function Home({
    heros,
    products,
    achievements,
    ourPartners,
    approveds,
}: Props) {
    const heroImages = heros
        .filter((hero) => Boolean(hero.image))
        .map((hero) => ({
            src: publicAsset(hero.image as string),
            alt: hero.title ?? 'Techno Electronics',
        }));

    return (
        <FrontendLayout>
            <SeoHead homepage />
            <Hero images={heroImages} />
            <Products products={products} />
            <OurAchievements achievements={achievements} />
            <BrandPartner partners={ourPartners} />
            <Approved approveds={approveds} />
        </FrontendLayout>
    );
}
