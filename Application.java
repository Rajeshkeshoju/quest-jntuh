class Application extends BaseApp{

    public Application(){
        setFrame();
        setFrameFullScreen();
        setTitle();
        setHeader("QUEST");
    }

    public static void main(String[] args){
        new Application();
    }
}