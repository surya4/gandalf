package xyz.suryasingh.javacounter;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;

        import android.os.Bundle;
        import android.support.v7.app.AppCompatActivity;
        import android.view.View;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.TextView;
        import java.text.NumberFormat;

import static android.content.Intent.ACTION_SENDTO;

/**
 * This app displays an order form to order coffee.
 */
public class MainActivity extends AppCompatActivity {
    int quantity = 2;
    int basePrice = 5;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
    }

    /**
     * This method is called when the order button is clicked.
     */

    public void increment(View view){
        quantity++;
    }
    public void decrement(View view){
        if (quantity > 0){
            quantity--;
        }
    }

    public void submitOrder(View view) {
        EditText text1 = (EditText) findViewById(R.id.name_field);
        String name = text1.getText().toString();
        EditText text2 = (EditText) findViewById(R.id.email_field);
        String email = text2.getText().toString();
        CheckBox whippedCream = (CheckBox) findViewById(R.id.whipped_check);
        boolean hasWhippedCream = whippedCream.isChecked();
        CheckBox chocolate = (CheckBox) findViewById(R.id.chocolate_check);
        boolean hasChocolate = chocolate.isChecked();
        int price = calculatePrice(hasWhippedCream,hasChocolate);
        String priceMessage = createOrderSummary(price,hasWhippedCream,hasChocolate,name);
//        displayMessage(priceMessage);

        Intent intent = new Intent(Intent.ACTION_SENDTO);
        intent.setData(Uri.parse("mailto:"+email));
        intent.putExtra(Intent.EXTRA_SUBJECT,"Coffee order for "+name);
        intent.putExtra(Intent.EXTRA_TEXT,priceMessage);
        if (intent.resolveActivity(getPackageManager())!=null)
            startActivity(intent);
    }

    public int calculatePrice(boolean hasWhippedCream,boolean hasChocolate){
        if (hasWhippedCream){
            basePrice++;
        }
        if (hasChocolate){
            basePrice+=2;
        }
        int price = quantity * basePrice;
//        displayPrice(price);
        return price;
    }

    public String createOrderSummary(int price,boolean hasWhippedCream, boolean hasChocolate,String name){
        String priceMessage = getString(R.string.order_summary_name,name);
        priceMessage += "\nAdd whipped cream : " + hasWhippedCream;
        priceMessage += "\nAdd chocolate : " + hasChocolate;
        priceMessage += "\nQuantity:" + quantity;
        priceMessage += "\nTotal $:" + price;
        priceMessage += "\n"+getString(R.string.thank_you);
    return  priceMessage;
    }

    /**
     * This method displays the given quantity value on the screen.
     */
    private void display(int number) {
        TextView quantityTextView = (TextView) findViewById(R.id.quantity_text_view);
        quantityTextView.setText("" + number);
    }
//    private void displayPrice(int number) {
//        TextView priceTextView = (TextView) findViewById(R.id.price_text_view);
//        priceTextView.setText("$"+number);
//    }

//    private void displayMessage(String message) {
//        TextView priceTextView = (TextView) findViewById(R.id.order_summary_text_view);
//        priceTextView.setText(message);
//    }



}
