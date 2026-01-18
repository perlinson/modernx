// ModernX GUI 主入口文件
import ModernXGUI from './components/ModernXGUI';

// 导出主组件
export default ModernXGUI;

// 如果需要在浏览器中直接使用
if (typeof window !== 'undefined') {
  window.ModernXGUI = ModernXGUI;
}
