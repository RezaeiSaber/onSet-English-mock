
# 🧠 onSet-English-mock  
*A learner-built simulation tool for learners everywhere.*

---

## ✨ Why I Built This

Hey! I'm a student who was preparing for the **onSET English language test** — a standardized test required for many German scholarships, universities, and exchange programs.

While studying, I realized something frustrating:

> **There were barely any useful or realistic practice materials online.**

No Cloze-style interactive tools, no answer checking, no timer — just a few PDF samples that didn't feel like the actual test.

So I decided to build my own.  
Not just for me — but for anyone in the same position, trying to prepare seriously without spending money or wasting time searching all over the internet.

This is my attempt to **give something back to the community**, and hopefully help fellow students get more confident and ready for the real thing.

---

## 🚀 What This Project Offers

This is a fully browser-based simulation of the official [onSET English test](https://www.onset.de/en), designed to match its format and challenge level as closely as possible.

### ✅ Features

- Cloze-style texts with masked words (e.g., `res_______`)
- First and last sentences of each text remain unchanged (like the real test)
- Upload your own `.txt` files with multiple texts, separated by `###`
- Choose how many texts to practice with (from 1 to 8)
- 5-minute countdown timer per text ⏱
- Inline blanks that accept your input
- One-click answer checking
- Instant scoring with percentage
- Option to show all correct answers
- 100% client-side — no account, no tracking, no server
- Mobile-friendly and works offline!

---

## 🔗 Try It Live

👉 [Click here to start practicing](https://rezaeisaber.github.io/onSet-English-mock)

No installation needed. Works on both desktop and mobile.

---

## 📄 How to Use

### 1. Prepare your `.txt` file like this:

```txt
###
This is your first practice text. It should be about 100–120 words long. The app will preserve the first and last sentence. All others will be partially masked to simulate the real onSET test.
###
This is another sample text. Use the same format. Separate each one using three hash marks (###).
````

Each text must start with `###`. You can include up to 8 texts per file.

---

### 2. Upload your file

On the homepage, upload your `.txt` file via the file picker. The app will parse your texts and ask you how many you want to include in your mock test.

---

### 3. Start your mock test

* Each text runs on a 5-minute timer
* You fill in the blanks (each shows 1–3 letters from the original word)
* At the end of each text, you can:

  * ✅ Check your answers
  * 📊 View your score & accuracy
  * 👁 Show the correct answers

---

## 🧠 How Cloze Masking Works

The app keeps the **first and last sentence of each text untouched**, and applies masking rules to all other sentences like this:

| Word Length | Cloze Format |
| ----------- | ------------ |
| 4 letters   | `r___`       |
| 5–6 letters | `re____`     |
| 7+ letters  | `res_______` |

Common words like `a`, `an`, `the`, `and`, `in`, `on`, etc. are **not** blanked out.
The goal is to simulate the real test logic — not random masking.


---

## 💡 Who This Is For

This tool is made for:

* Students preparing for the onSET English exam
* Teachers who want to create custom Cloze practice
* Self-learners aiming for CEFR B2 or C1
* Anyone who wants to practice focused, grammar-based English reading

---

## 🔄 New Practice Files Coming Soon

I’ll be **regularly uploading new `.txt` files** with fresh practice texts.

Just check back in this repo, and you’ll find updated files you can download and use.

📝 You can also create your own practice files!
Just follow these rules:

* File must be `.txt`
* Each new text starts with `###`
* Each text should be 80–120 words long
* Upload the file — and the app will convert it into an interactive test

It’s flexible, fast, and open to your creativity!

---

## 🙌 Why This Matters

This isn't a corporate tool or a paid product.
It's something I built as a student, during my own test prep, to help **others like me**.

If you find this useful, please consider:

* Sharing it with other students
* Creating and submitting your own practice files
* Contributing to the code or opening issues

Let’s support each other in the simplest ways — one test at a time.

---

## 📜 License

This project is licensed under the MIT License.
Feel free to use, modify, or build upon it.
A credit would be appreciated if you share it publicly.

---

## 👤 Author

**Saber Rezaei**
Biomedical Engineering | Neurocognitive & ML Enthusiast
🌐 [rezaeisaber.github.io](https://rezaeisaber.github.io)

---

```

