package xyz.suryasingh.basketcounter;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.TextView;

public class MainActivity extends AppCompatActivity {

    int countA = 0;
    int countB = 0;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
    }

    public void plusThreeToA(View view){
        countA += 3;
        displayA(countA);
    }

    public void plusTwoToA(View view){
        countA += 2;
        displayA(countA);
    }

    public void freeThrowToA(View view){
        countA ++;
        displayA(countA);
    }

    public void plusThreeToB(View view){
        countB += 3;
        displayB(countB);
    }

    public void plusTwoToB(View view){
        countB += 2;
        displayB(countB);
    }

    public void freeThrowToB(View view){
        countB ++;
        displayB(countB);
    }

    public void resetScore(View view) {
        countA = 0;
        countB = 0;
        displayA(countA);
        displayB(countB);
    }

    /**
     * This method displays the given quantity value on the screen.
     */
    private void displayA(int number) {
        TextView quantityTextView = (TextView) findViewById(R.id.team_a_score);
        quantityTextView.setText("" + number);
    }

    private void displayB(int number) {
        TextView quantityTextView = (TextView) findViewById(R.id.team_b_score);
        quantityTextView.setText("" + number);
    }


}
