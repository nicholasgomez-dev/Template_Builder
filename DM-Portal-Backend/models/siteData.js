const site = {
    ID: "",
    name: "",
    currentTemplateId: "",
    currentTemplateVersion: "",
};

const siteData = {
    siteSettings: {
        data: "",
    },
    pages: [
        {
            pageID: "",
            slug: "",
            navTitle: "",
            title: "",
            content: {
                quote1: {
                    value: "",
                },
                image1: {
                    value: "",
                },
                textarea: {
                    value: "",
                },
                goodText: {
                    value: "",
                },
            },
        },
    ],
    sitemap: [
        {
            urlSlug: "",
            navTitle: "",
        },
    ],
    theme: {
        colors: {
            primary: "",
            secondary: "",
            tertiary: "",
        },
    },
    site: site,
};

const siteAWSResources = {
    websiteBucketName: "",
    websiteURL: "",
    cloudFrontName: "",
    cloudFrontURL: "",
    site: site,
};

const imageData = {
    imageTitle: "",
    imageTimestamp: "",
    imageCdnUrl: "",
    siteID: "",
}	

const template = {
    skeletonFile: "",
    templateFile: "",
    templateVersion: "",
    templateId: "",
    templateMetaData: {
        pages: [
            {
                pageID: "",
                content: [
                    {
                        identifier: "",
                        title: "",
                        description: "",
                        type: "",
                    }
                ],
            },
        ],
    },
};


module.exports = { template, siteAWSResources, site, siteData, imageData }
