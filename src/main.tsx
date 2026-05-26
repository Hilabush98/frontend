import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client"
import { ApolloProvider } from "@apollo/client/react"

import "./index.css"
import App from "./App.tsx"
import { ThemeProvider } from "@/components/theme-provider.tsx"
const client = new ApolloClient({
  link: new HttpLink({ uri: "http://localhost:8080/" }),
  cache: new InMemoryCache(),
})

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </ThemeProvider>
  </StrictMode>
)
