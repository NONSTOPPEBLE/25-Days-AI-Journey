print("🚀 Day 2: Smart Calculator")
print("💻 Now coding on laptop too — LEVEL UP!")
print("-----------------------------")

# 🧮 Take first number
num1 = float(input("🔢 Enter first number: "))

# 🎯 Show operator menu
print("""
✏️ Select an operation:
1 ➕ Addition
2 ➖ Subtraction
3 ✖️ Multiplication
4 ➗ Division
5 🔁 Modulus
6 🔥 Power
""")
choice = input("Enter option (1–6): ")

# 🔢 Take second number
num2 = float(input("🔢 Enter second number: "))

# ⚙️ Perform operation
if choice == "1":
    result = num1 + num2
elif choice == "2":
    result = num1 - num2
elif choice == "3":
    result = num1 * num2
elif choice == "4":
    result = "🚫 Can't divide by 0" if num2 == 0 else num1 / num2
elif choice == "5":
    result = num1 % num2
elif choice == "6":
    result = num1**num2
else:
    result = "❌ Invalid choice"

# ✅ Show result
print("-----------------------------")
print("📊 Result:", result)
print("🎉 Day 2 Complete – You’re Smarter Already!")
print("A code by @hackthecode09")
