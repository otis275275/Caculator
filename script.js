const input = document.querySelector('.display')
const inputRes = document.querySelector('.show-display')
const btn = document.querySelectorAll('.btn-show-js')
const btn_clear = document.querySelector('.btn-clear')
const btn_equal = document.querySelector('.btn-equal')
const btn_square = document.querySelector('.btn-square')
const btn_square_root = document.querySelector('.btn-square-root')
const btn_sign = document.querySelector('.btn-sign')
const btn_divide_by_one = document.querySelector('.btn-divided-by-one')
const btn_ce = document.querySelector('.btn-ce')
const btn_backspace = document.querySelector('.btn-backspace')
const btn_percent = document.querySelector('.btn-percent')
const historyList = document.getElementById('history-list')
const btnClearHistory = document.querySelector('#clear-history');
const historyToggle = document.getElementById('history-toggle');
const historyEl = document.querySelector('.history');
const overlay = document.getElementById('overlay');
const calculator = document.querySelector('.calculator');



// guard in case elements missing
if (historyToggle && historyEl && overlay && calculator) {
  // toggle history when tapping the time icon (mobile)
  historyToggle.addEventListener('click', () => {
    const opening = !historyEl.classList.contains('show');
    historyEl.classList.toggle('show', opening);
    overlay.classList.toggle('active', opening);
    calculator.classList.toggle('disabled', opening);
  });

  // clicking overlay closes history
  overlay.addEventListener('click', () => {
    historyEl.classList.remove('show');
    overlay.classList.remove('active');
    calculator.classList.remove('disabled');
  });
}




const btns = Array.from(btn)
const operators = ['+', '-', '*', '/']
const numberBtns = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

function handleClickHistory(expr, res) {
    input.value = expr
    inputRes.value = res
}

//hàm tạo lịch sử
function addHistory(expr, result) {
    const li = document.createElement('li')
    li.innerHTML = `<span class="expr">
                        ${expr}=</span><span class="result">${result}
                    </span>`
    li.onclick = () => {
        handleClickHistory(expr, result)
    }
    historyList.prepend(li) // mới nhất lên trên
}

btnClearHistory.addEventListener('click', () => {
    // Xóa toàn bộ nội dung trong history
    historyList.innerHTML = '';
});

// Nút show trên input
btns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        const char = e.target.innerText
        let value = input.value
        const lastChar = value.slice(-1)

        // Nếu trước đó đã có kết quả (inputRes) -> xử lý khác nhau với toán tử và số
        if (inputRes.value !== '') {
            if (operators.includes(char)) {
                // Bấm toán tử sau khi có kết quả: hiển thị result + operator
                // giữ inputRes để người dùng thấy kết quả trước đó
                input.value = inputRes.value + char
                return
            } else if (numberBtns.includes(char)) {
                // Bấm số sau khi có kết quả:
                // nếu input đang kết thúc bằng toán tử (ví dụ "12+") -> append số
                if (operators.includes(lastChar)) {
                    input.value = value + char
                    // đã bắt đầu nhập toán hạng mới -> xóa result
                    inputRes.value = ''
                    return
                } else {
                    // không có toán tử ở cuối -> bắt đầu phép tính mới (reset)
                    input.value = char
                    inputRes.value = ''
                    return
                }
            }
        }
        // Nếu giá trị hiện tại là '0' và người dùng bấm số -> thay thế '0'
        if (value === '0' && numberBtns.includes(char)) {
            input.value = ''
        }

        // Kiểm tra xem có toán tử nào trong chuỗi hiện tại chưa (dành cho logic sau)
        const hasOperator = operators.some(op => value.includes(op))

        // Nếu người dùng bấm toán tử khi đang nhập biểu thức
        if (operators.includes(char)) {
            // Nếu đã có phép tính hoàn chỉnh (vd: 2+3) và ký tự cuối không phải operator -> tự tính trước
            if (hasOperator && !operators.includes(lastChar)) {
                btn_equal.click()
                // Hiển thị kết quả trong input và giữ inputRes để người dùng thấy
                input.value = inputRes.value + char
                return
            }
            // Nếu bấm nhiều operator liên tiếp -> chỉ giữ toán tử cuối
            if (operators.includes(lastChar)) {
                input.value = value.slice(0, -1)
            }
        }

        // Thêm ký tự vừa bấm (số hoặc toán tử nếu chưa return phía trên)
        input.value += char
    })
})

// Clear button
btn_clear.addEventListener('click', () => {
    input.value = '0'
    inputRes.value = ''
})

// equal button
btn_equal.addEventListener('click', () => {
    const value = input.value
    const isLastOperator = operators.includes(value.slice(-1))
    console.log('is last operator:' , isLastOperator) 

    //Nếu phần tử cuối chuỗi là operators
    if (isLastOperator) {
        const firstOperand = value.slice(0, -1)
        console.log(firstOperand)
        input.value += firstOperand
    }

    const tempInput = input.value
    // input.value += '='
    inputRes.value = eval(tempInput)
    addHistory(value, inputRes.value)
})


//**Nút đổi dấu (khó) */
btn_sign.addEventListener('click', () => {
  let value = input.value.trim()
  if (!value) return

  // Hàm tìm toán tử cuối (phân cách toán hạng)
  function findLastOperatorIndex(str) {
    for (let i = str.length - 1; i >= 0; i--) {
      const ch = str[i]
      if (ch === '+' || ch === '*' || ch === '/') return i
      if (ch === '-') {
        if (i === 0) continue
        const prev = str[i - 1]
        if (prev === '+' || prev === '-' || prev === '*' || prev === '/') continue
        return i
      }
    }
    return -1
  }

  const lastOpIndex = findLastOperatorIndex(value)
  let lastNum = value.slice(lastOpIndex + 1)
  if (!lastNum) return

  // Toán tử phía trước (nếu có)
  const prevOp = lastOpIndex >= 0 ? value[lastOpIndex] : null

  let newValue
  if (prevOp === '+' || prevOp === '-') {
    // Nếu toán tử trước là + hoặc -, thì đổi thành toán tử ngược lại
    const invertedOp = prevOp === '+' ? '-' : '+'
    newValue = value.slice(0, lastOpIndex) + invertedOp + lastNum
  } else {
    // Nếu toán tử trước là * / hoặc không có toán tử, toggle dấu bình thường
    if (lastNum.startsWith('-')) {
      lastNum = lastNum.slice(1)
    } else {
      lastNum = '-' + lastNum
    }
    newValue = (lastOpIndex === -1) ? lastNum : value.slice(0, lastOpIndex + 1) + lastNum
  }

  input.value = newValue
})


//Nút 1/x
btn_divide_by_one.addEventListener('click', () => {
    let currentValue = inputRes.value || input.value

    if (!currentValue || currentValue === '0') return

    // Hiển thị biểu thức đang tính
    input.value = `1/(${currentValue})`

    const result = 1 / parseFloat(currentValue)

    // Hiển thị kết quả
    inputRes.value = result
})


//Nút square
btn_square.addEventListener('click', () => {
    let currentValue = inputRes.value || input.value

    if (!currentValue) return

    // Hiển thị biểu thức trên input
    input.value = `(${currentValue})²`

    // Tính kết quả bình phương
    const result = Math.pow(parseFloat(currentValue), 2)

    // Hiển thị kết quả
    inputRes.value = result
})

//Nút square root
btn_square_root.addEventListener('click', () => {
    let currentValue = inputRes.value || input.value

    if (!currentValue) return

    // Hiển thị biểu thức trên input
    input.value = `√(${currentValue})`

    // Tính căn bậc 2
    const result = Math.sqrt(parseFloat(currentValue))

    // Hiển thị kết quả
    inputRes.value = result
})


//Nút CE
// Nút CE (Clear Entry)
btn_ce.addEventListener('click', () => {
    const value = input.value

    // Nếu chỉ có 1 số hoặc rỗng -> reset về 0
    if (value.length <= 1) {
        input.value = '0'
        return
    }

    // Tìm vị trí toán tử gần nhất để xóa
    const lastOpIndex = Math.max(
        value.lastIndexOf('+'),
        value.lastIndexOf('-'),
        value.lastIndexOf('*'),
        value.lastIndexOf('/')
    )

    // Nếu không có toán tử nào, xóa toàn bộ (như C)
    if (lastOpIndex === -1) {
        input.value = '0'
    } else {
        // Giữ lại phần trước toán tử cuối
        input.value = value.slice(0, lastOpIndex + 1)
    }

    // Xóa kết quả hiển thị
    inputRes.value = ''
})

//Nút backspace

btn_backspace.addEventListener('click', () => {
    let value = input.value

    if (value.length <= 1) {
        input.value = '0'
        inputRes.value = ''
        return
    }

    // Xóa ký tự cuối cùng
    input.value = value.slice(0, -1)
})

btn_percent.addEventListener('click', () => {
    let value = input.value.trim()
    if (!value) return

    const lastOpIndex = Math.max(
        value.lastIndexOf('+'),
        value.lastIndexOf('-'),
        value.lastIndexOf('*'),
        value.lastIndexOf('/')
    )

    if (lastOpIndex === -1) {
        // Không có toán tử -> % của số hiện tại (vẫn hiển thị tham khảo)
        const num = parseFloat(value)
        if (isNaN(num)) return
        inputRes.value = num / 100
        // nếu muốn thay input để '=' dùng luôn giá trị phần trăm, uncomment:
        // input.value = (num / 100).toString()
    } else {
        const operator = value[lastOpIndex]
        const firstOperand = parseFloat(value.slice(0, lastOpIndex))
        const secondOperand = parseFloat(value.slice(lastOpIndex + 1))

        if (isNaN(firstOperand) || isNaN(secondOperand)) return

        let percentValue = 0

        if (operator === '+' || operator === '-') {
            // cộng/trừ -> % của số đầu
            percentValue = firstOperand * (secondOperand / 100)

            // Hiển thị tạm trong result
            inputRes.value = percentValue

            // **Thay input**: để khi bấm '=' sẽ tính đúng (50 + 5 => 55)
            // Lưu ý: dùng toString() hoặc toFixed nếu cần format
            input.value = `${firstOperand}${operator}${percentValue}`
        } else if (operator === '*' || operator === '/') {
            // nhân/chia -> % = số cuối / 100
            percentValue = secondOperand / 100
            inputRes.value = percentValue

            // Thay input cho phép eval đúng (ví dụ 50 * 0.1)
            input.value = `${firstOperand}${operator}${percentValue}`
        }
    }
})

document.addEventListener('keydown', (e) => {
  const key = e.key
  const button = document.querySelector(`button[data-key="${key}"]`)

  if (button) {
    button.classList.add('active')
    button.click() // ✅ Simulate real button click

    // Remove highlight after short delay
    setTimeout(() => button.classList.remove('active'), 150)
  }
})
