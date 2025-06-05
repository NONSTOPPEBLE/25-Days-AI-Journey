"""
Massively expanded ASCII art generator script.
Purpose: Demonstrate making the generator script itself very large,
by adding huge amounts of repeated code, verbose comments, and dummy functions.
"""

import random

# --- Helper function repeated 10 times with slight variations to increase code size ---
def func_header_1(name, num):
    # Generate function header string
    return f"def {name}_{num}_v1():"

def func_header_2(name, num):
    # Another version of function header (not used but here to increase size)
    return f"def {name}_{num}_v2():"

def func_header_3(name, num):
    # More headers, increasing code size artificially
    return f"def {name}_{num}_v3():"

def func_header_4(name, num):
    return f"def {name}_{num}_v4():"

def func_header_5(name, num):
    return f"def {name}_{num}_v5():"

def func_header_6(name, num):
    return f"def {name}_{num}_v6():"

def func_header_7(name, num):
    return f"def {name}_{num}_v7():"

def func_header_8(name, num):
    return f"def {name}_{num}_v8():"

def func_header_9(name, num):
    return f"def {name}_{num}_v9():"

def func_header_10(name, num):
    return f"def {name}_{num}_v10():"

# -- Repeated dummy docstring generator functions --
def add_docstring_1(name):
    return f'    """\n    This is a massive function for {name} pattern v1.\n    Auto-generated code.\n    """'

def add_docstring_2(name):
    return f'    """\n    This is a massive function for {name} pattern v2.\n    Auto-generated code.\n    """'

def add_docstring_3(name):
    return f'    """\n    This is a massive function for {name} pattern v3.\n    Auto-generated code.\n    """'

# -- Actual pattern function repeated with slight variation 5 times to increase size --

def print_triangle_v1(size=10, char='*'):
    lines = [add_docstring_1("triangle v1")]
    for i in range(1, size + 1):
        lines.append(f"    print('{' ' * (size - i)}' + char * i)")
    lines.append("    # dummy loop for bulk")
    for i in range(1000):  # big dummy loop
        lines.append(f"    _ = {i} * 2")
    lines.append("    return size")
    return lines

def print_triangle_v2(size=10, char='*'):
    lines = [add_docstring_2("triangle v2")]
    for i in range(1, size + 1):
        lines.append(f"    print('{' ' * (size - i)}' + char * (i * 2))")
    lines.append("    # dummy computation v2")
    for i in range(500):
        lines.append(f"    _ = {i} + 1000")
    lines.append("    return size * 2")
    return lines

def print_triangle_v3(size=10, char='*'):
    lines = [add_docstring_3("triangle v3")]
    for i in range(1, size + 1):
        lines.append(f"    print(char * (size - i + 1))")
    lines.append("    # dummy heavy code v3")
    for i in range(300):
        lines.append(f"    _ = i ** 2")
    lines.append("    return size")
    return lines

# --- Repeat dummy functions like these for square, pyramid, diamond ---

def print_square_v1(size=10, char='*'):
    lines = [add_docstring_1("square v1")]
    for _ in range(size):
        lines.append(f"    print(char * size)")
    for i in range(700):
        lines.append(f"    _ = i % 3")
    lines.append("    return size * size")
    return lines

def print_square_v2(size=10, char='*'):
    lines = [add_docstring_2("square v2")]
    for _ in range(size):
        lines.append(f"    print(char * (size + 2))")
    for i in range(600):
        lines.append(f"    _ = (i * 3) % 7")
    lines.append("    return (size + 2) ** 2")
    return lines

def print_square_v3(size=10, char='*'):
    lines = [add_docstring_3("square v3")]
    for _ in range(size):
        lines.append(f"    print(' ' + char * size)")
    for i in range(1000):
        lines.append(f"    _ = i - 5")
    lines.append("    return size * 2")
    return lines

# --- Now repeat this dummy pattern for all your functions in multiple versions to blow up lines ---

# --- Dummy extra utility functions, lots of them ---
def dummy_util_func_1():
    """Dummy utility function 1"""
    total = 0
    for i in range(10000):
        total += i
    return total

def dummy_util_func_2():
    """Dummy utility function 2"""
    lst = []
    for i in range(5000):
        lst.append(i * 2)
    return lst

def dummy_util_func_3():
    """Dummy utility function 3"""
    s = "x" * 10000
    for c in s:
        pass
    return len(s)

def dummy_util_func_4():
    """Dummy utility function 4"""
    d = {i: i*i for i in range(2000)}
    return d

def dummy_util_func_5():
    """Dummy utility function 5"""
    return sum(range(100000))

# --- Large comment blocks to bloat file ---
"""
====================================================================================
 This script is a MASSIVE generated file intended to be HUGE for fun or testing.
 It contains repeated functions, dummy loops, and large comments to inflate size.
====================================================================================
"""

"""
====================================================================================
 REPEAT the above comment blocks multiple times as needed to increase lines.
====================================================================================
"""

# -- Main generator function stub (very simplified here) --
def generate_ascii_art_code(filename="ascii_art_patterns_big.py", total_lines=10000):
    # For brevity, just write a simple line repeatedly to create a large file
    with open(filename, "w") as f:
        f.write("# This is a massively large generated ASCII art patterns file\n\n")
        for i in range(total_lines):
            f.write(f"# Line {i+1}: This is filler line to increase file size\n")

    print(f"Generated {filename} with {total_lines} lines of filler.")

# Run dummy utils on script start (just to fill code lines)
dummy_util_func_1()
dummy_util_func_2()
dummy_util_func_3()
dummy_util_func_4()
dummy_util_func_5()

if __name__ == "__main__":
    generate_ascii_art_code()
