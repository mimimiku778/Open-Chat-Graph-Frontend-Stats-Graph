export default function horizontalLabelFontColorCallback(context: any) {
  let label = context.tick.label
  if (Array.isArray(label)) {
    label = label[1]
  }

  if (label.includes('土')) {
    return '#44617B'
  } else if (label.includes('日')) {
    return '#9C3848'
  } else {
    return 'black'
  }
}