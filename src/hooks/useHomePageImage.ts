import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface HomePageImage {
    url: string | null;
    alt: string | null;
}

export const useHomePageImage = () => {
    const [image, setImage] = useState<HomePageImage>({
        url: null,
        alt: null,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const { data, error } = await supabase
                    .from("site_content")
                    .select("content")
                    .eq("page", "home")
                    .eq("section", "hero")
                    .single();

                if (!error && data) {
                    const content = data.content as any;
                    setImage({
                        url: content?.hero_image_url || null,
                        alt: content?.hero_image_alt || null,
                    });
                }
            } catch (err) {
                console.error("Error fetching home page image:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchImage();
    }, []);

    return { image, loading };
};