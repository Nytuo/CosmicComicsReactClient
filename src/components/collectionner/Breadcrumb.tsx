import * as React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import {t} from "i18next";

function handleClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    event.preventDefault();
    console.info('You clicked the breadcrumb ' + event.target);
}

export default function CollapsedBreadcrumbs({breadcrumbs}: {
    breadcrumbs: { text: string; onClick: () => void; }[];
}) {
    return (
        <div role="presentation" onClick={handleClick} style={{marginLeft: "15px"}}>
            <Breadcrumbs maxItems={2} aria-label={t('breadcrumb')}>
                {
                    breadcrumbs.map(({text, onClick}, index) => {
                        if (index === breadcrumbs.length - 1) return [];
                        return <Link key={index} underline="hover" color="inherit" href="#" onClick={onClick}>
                            {text}
                        </Link>;
                    })
                }
                <Typography color="text.primary">{breadcrumbs[breadcrumbs.length - 1]?.text}</Typography>
            </Breadcrumbs>
        </div>
    );
}