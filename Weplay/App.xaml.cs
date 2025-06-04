namespace Weplay
{
    public partial class App : Application
    {
        public App()
        {
            InitializeComponent();
        }

        protected override Window CreateWindow(IActivationState? activationState)
        {
            var mainPage = new MainPage();
            Window window = new Window(mainPage);

            TitleBar titleBar = new TitleBar();
            titleBar.BackgroundColor = Color.FromRgba(24, 24, 27, 255);
            titleBar.ForegroundColor = Colors.White;
            titleBar.Title = "Weplay";

            window.TitleBar = titleBar;
            return window;
        }
    }
}
