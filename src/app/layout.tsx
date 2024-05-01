import '../styles/globals.scss';

import React from 'react';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html>
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <title>Airport Shuttle Reservation</title>
            </head>
            <body className="h-full">
                {children}
            </body>
        </html>
    )
}
