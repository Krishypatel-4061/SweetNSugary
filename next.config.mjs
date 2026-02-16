/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            { protocol: "https", hostname: "www.lifeloveandsugar.com" },
            { protocol: "https", hostname: "images.unsplash.com" },
            { protocol: "https", hostname: "i.ytimg.com" },
            { protocol: "https", hostname: "www.marcellinaincucina.com" },
            { protocol: "https", hostname: "lifemadesweeter.com" },
            { protocol: "https", hostname: "thumbs.dreamstime.com" },
            { protocol: "https", hostname: "media.istockphoto.com" },
            { protocol: "https", hostname: "www.womangettingmarried.com" },
        ],
    },
};

export default nextConfig;
