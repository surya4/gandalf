package xyz.suryasingh.quizapp;

import android.content.Context;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.EditText;
import android.widget.RadioGroup;
import android.widget.RadioButton;
import android.widget.TextView;
import android.widget.Toast;

import static android.R.attr.duration;

public class MainActivity extends AppCompatActivity {

    int score = 0;
    int answered = 0;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
    }

    public void questionOne(View v){
        if (v.getId()==R.id.q1_a){
            score+=10;
            answered++;
        }
    }
    public void questionTwo(View v){
        if (v.getId()==R.id.q2_d){
            score+=10;
            answered++;
        }
    }
    public void questionThree(View v){
        if (v.getId()==R.id.q3_a && v.getId()==R.id.q3_b){
            score+=15;
            answered++;
        }
    }
    public void questionFour(View v){
        if (v.getId()==R.id.q4_a && v.getId()==R.id.q4_c){
            score+=15;
            answered++;
        }
    }
    public void questionFive(View v){
        EditText text1 = (EditText) findViewById(R.id.q5);
        String name = text1.getText().toString();
        if (name=="abra"){
            score+=25;
            answered++;
        }
    }
    public void questionSix(View v){
        EditText text1 = (EditText) findViewById(R.id.q6);
        String name = text1.getText().toString();
        if (name=="dabra"){
            score+=25;
            answered++;
        }
    }

    public void submitTest(View v){
        if (answered==6){
            String str = "Your score is " + score;
            Toast.makeText(getApplicationContext(), str, Toast.LENGTH_LONG).show();
        } else {
            String text = "Please answer all the questions";
            Toast.makeText(getApplicationContext(), text, Toast.LENGTH_LONG).show();
        }

    }

}
