import uvicorn


class App:
    ...


app = App()

if __name__ == "__main__":
    uvicorn.run("app.server:router", host="127.0.0.1", port=5000, log_level="info")
