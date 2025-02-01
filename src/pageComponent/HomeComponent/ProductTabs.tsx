import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Featured from './ProductTabs/Featured';
import OnSale from './ProductTabs/OnSale';
import TopRated from './ProductTabs/TopRated';

const ProductTabs = () => {
    return (
        <div className='min-h-screen py-32'>
            <Tabs defaultValue="featured" className="w-full mx-auto">
                <TabsList className="grid w-2/5 mx-auto grid-cols-3 bg-transparent pb-20 text-primary-foreground">
                    <TabsTrigger value="featured" className='font-bold text-2xl'>Featured</TabsTrigger>
                    <TabsTrigger value="onsale" className='font-bold text-2xl'>On Sale</TabsTrigger>
                    <TabsTrigger value="top" className='font-bold text-2xl'>Top Rated</TabsTrigger>
                </TabsList>
                <TabsContent value="featured">
                    <Featured />
                </TabsContent>
                <TabsContent value="onsale">
                    <OnSale />
                </TabsContent>
                <TabsContent value="top">
                    <TopRated />
                </TabsContent>
            </Tabs>
        </div>
    );
}

export default ProductTabs;
