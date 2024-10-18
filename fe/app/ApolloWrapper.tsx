"use client"

import React from "react";
import {ApolloClient, InMemoryCache, NormalizedCacheObject, ApolloProvider} from "@apollo/client";


export const ApolloProviders = ( {children} : {children: React.ReactNode}) => {
    const uri: string = `localhost/graphql`;
    const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
        uri: uri,
        cache: new InMemoryCache(),
    });

    return <ApolloProvider client={client}>{children}</ApolloProvider>
};