// src/hooks/useHomePageImage.ts
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface HomePageImage {
    url: string | null;
    alt: string | null;
}

// Cache the image data
let cachedImage: HomePageImage | null = null;
let fetchPromise: Promise<HomePageImage | null> | null = null;

export const useHomePageImage = () => {
    const [image, setImage] = useState<HomePageImage>(cachedImage || { url: null, alt: null });
    const [loading, setLoading] = useState(!cachedImage);

    useEffect(() => {
        // If we already have cached data, don't fetch
        if (cachedImage) {
            setImage(cachedImage);
            setLoading(false);
            return;
        }

        // Prevent multiple simultaneous fetches
        if (!fetchPromise) {
            fetchPromise = (async () => {
                try {
                    const { data, error } = await supabase
                        .from("site_content")
                        .select("content")
                        .eq("page", "home")
                        .eq("section", "hero")
                        .single();

                    if (!error && data) {
                        const content = data.content as any;
                        cachedImage = {
                            url: content?.hero_image_url || null,
                            alt: content?.hero_image_alt || null,
                        };
                        return cachedImage;
                    }
                    return null;
                } catch (err) {
                    console.error("Error fetching home page image:", err);
                    return null;
                }
            })();
        }

        fetchPromise.then((result) => {
            if (result) {
                setImage(result);
            }
            setLoading(false);
        });
    }, []);

    return { image, loading };
};