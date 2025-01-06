import { useEffect, useState } from 'react';

const useInfiniteScroll = (fetchData: (page: number) => Promise<any>, hasMore: boolean) => {
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const handleScroll = () => {
        if (loading || !hasMore) return;

        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        if (scrollTop + clientHeight >= scrollHeight - 5) {
            setLoading(true);
        }
    };

    useEffect(() => {
        if (!loading) return;

        fetchData(page).then(() => {
            setPage((prev) => prev + 1);
            setLoading(false);
        });
    }, [loading, fetchData, page]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [loading, hasMore]);

    return { loading, page };
};

export default useInfiniteScroll;