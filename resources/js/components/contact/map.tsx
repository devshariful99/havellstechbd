interface MapProps {
    embedUrl: string;
    height?: number;
}

export default function Map({ embedUrl, height = 450 }: MapProps) {
    return (
        <div className="w-full">
            <iframe
                src={embedUrl}
                className="w-full"
                height={height}
                loading="lazy"
                title="Office location map"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
            ></iframe>
        </div>
    );
}
