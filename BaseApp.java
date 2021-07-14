import java.awt.Image;
import java.awt.Color;
import java.awt.Font;

import java.io.IOException;
import java.net.URL;
import java.util.Calendar;  

import javax.swing.JFrame;
import javax.swing.JComponent;
import javax.swing.JLabel;
import javax.imageio.ImageIO;

public class BaseApp {  

    private static JFrame f; 
    private static Image icon = null; 
    private static String headerTitle = "QUEST :: JNTUHCEH";
    private static String iconUrl = "https://scontent.fhyd15-1.fna.fbcdn.net/v/t1.6435-9/84678895_2720382278050483_5023563585293385728_n.jpg?_nc_cat=108&ccb=1-3&_nc_sid=973b4a&_nc_ohc=n9sGomrmZMwAX9D5GAq&_nc_ht=scontent.fhyd15-1.fna&oh=066e257089d94ccfb6ab7a9904727a07&oe=60F23D6D";

    public static void setFrame(){
        setFrame(420, 420);
    }
    public static void setFrame(int width, int height){  
        f = new JFrame();   
        f.dispose();

        loadTitlebarIcon();

        f.setSize(width, height); 
        f.setVisible(true);
    }

    private static void loadTitlebarIcon(){
        if(icon == null){
            try {
                URL url = new URL(iconUrl);
                icon = ImageIO.read(url);

                f.setIconImage(icon);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    public static void addView(JComponent component){
        f.add(component);
    }

    public static void setFrameFullScreen(){
        f.setExtendedState(JFrame.MAXIMIZED_BOTH);
    }

    public static void setFrameDecoration(boolean isDecorated){
        f.setUndecorated(!isDecorated);
    }

    public static void setTitle(){
        setTitle(headerTitle);
    }

    public static void setTitle(String title){
        f.setTitle(title);
    }

    public static void setHeader(String title){
        int year = Calendar.getInstance().get(Calendar.YEAR);
        title = title + " - " + year;

        JLabel header = new JLabel(title);
        header.setFont(new Font("Monospaced", Font.PLAIN, 24));
        header.setForeground(Color.BLUE);
        header.setHorizontalAlignment(JLabel.CENTER);

        addView(header);
    }
}  