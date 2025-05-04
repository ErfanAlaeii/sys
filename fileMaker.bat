set /p Input=Enter some text: 
echo f | xcopy /f /y "E:\system\controllers\tests.controller.js" "E:\system\controllers\%Input%.controller.js"
echo f | xcopy /f /y "E:\system\models\tests.model.js" "E:\system\models\%Input%.model.js"
echo f | xcopy /f /y "E:\system\routers\tests.router.js" "E:\system\routers\%Input%.router.js"
code "" "E:\system\controllers\%Input%.controller.js" | exit
code "" "E:\system\models\%Input%.model.js" | exit
code "" "E:\system\routers\%Input%.router.js" | exit




pause