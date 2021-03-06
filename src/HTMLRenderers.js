import React from 'react';
import { TouchableOpacity, Text, View, WebView, Dimensions } from 'react-native';
import { _constructStyles } from './HTMLStyles';
import HTMLImage from './HTMLImage';

export function a (htmlAttribs, children, convertedCSSStyles, passProps) {
    const style = _constructStyles({
        tagName: 'a',
        htmlAttribs,
        passProps,
        styleSet: passProps.parentWrapper === 'Text' ? 'TEXT' : 'VIEW'
    });
    // !! This deconstruction needs to happen after the styles construction since
    // the passed props might be altered by it !!
    const { parentWrapper, onLinkPress, key, data } = passProps;
    const onPress = (evt) => onLinkPress && htmlAttribs && htmlAttribs.href ?
        onLinkPress(evt, htmlAttribs.href, htmlAttribs) :
        undefined;

    if (parentWrapper === 'Text') {
        return (
            <Text {...passProps} style={style} onPress={onPress} key={key}>
                { children || data }
            </Text>
        );
    } else {
        return (
            <TouchableOpacity onPress={onPress} key={key}>
                { children || data }
            </TouchableOpacity>
        );
    }
}

export function img (htmlAttribs, children, convertedCSSStyles, passProps = {}) {
    if (!htmlAttribs.src) {
        return false;
    }

    const style = _constructStyles({
        tagName: 'img',
        htmlAttribs,
        passProps,
        styleSet: 'IMAGE'
    });
    const { src, alt, width, height } = htmlAttribs;
    return (
        <HTMLImage
          source={{ uri: src }}
          alt={alt}
          width={width}
          height={height}
          style={style}
          {...passProps}
        />
    );
}

export function ul (htmlAttribs, children, convertedCSSStyles, passProps = {}) {
    const style = _constructStyles({
        tagName: 'ul',
        htmlAttribs,
        passProps,
        styleSet: 'VIEW'
    });
    const { rawChildren, nodeIndex, key, baseFontStyle, listsPrefixesRenderers } = passProps;
    const baseFontSize = baseFontStyle.fontSize || 14;

    children = children && children.map((child, index) => {
        const rawChild = rawChildren[index];
        let prefix = false;
        const rendererArgs = [
            htmlAttribs,
            children,
            convertedCSSStyles,
            {
                ...passProps,
                index
            }
        ];

        if (rawChild) {
            if (rawChild.parentTag === 'ul') {
                prefix = listsPrefixesRenderers && listsPrefixesRenderers.ul ? listsPrefixesRenderers.ul(...rendererArgs) : (
                    <View style={{
                        marginRight: 10,
                        width: baseFontSize / 2.8,
                        height: baseFontSize / 2.8,
                        marginTop: baseFontSize / 2,
                        borderRadius: baseFontSize / 2.8,
                        backgroundColor: 'black'
                    }} />
                );
            } else if (rawChild.parentTag === 'ol') {
                prefix = listsPrefixesRenderers && listsPrefixesRenderers.ol ? listsPrefixesRenderers.ol(...rendererArgs) : (
                    <Text style={{ marginRight: 5, fontSize: baseFontSize }}>{ index + 1 })</Text>
                );
            }
        }
        return (
            <View key={`list-${nodeIndex}-${index}-${key}`} style={{ flexDirection: 'row', marginBottom: 10 }}>
                { prefix }
                <View style={{ flex: 1 }}>{ child }</View>
            </View>
        );
    });
    return (
        <View style={style} key={key}>
            { children }
        </View>
    );
}
export const ol = ul;

export function iframe (htmlAttribs, children, convertedCSSStyles, passProps) {
    if (!htmlAttribs.src) {
        return false;
    }

    const { staticContentMaxWidth, height, width } = passProps;
    const style = _constructStyles({
        tagName: 'iframe',
        htmlAttribs,
        passProps,
        styleSet: 'VIEW',
        additionalStyles: [
            {
                height: _getHeightForIframe(htmlAttribs, passProps)
            },
            {
                width: _getWidthForIframe(htmlAttribs, passProps)
            }
        ]
    });

    return (
        <WebView key={passProps.key} source={{ uri: htmlAttribs.src }} style={style} />
    );
}

function _getHeightForIframe(htmlAttribs, passProps) {
  let { height } = passProps

  if(!height) {
    if(htmlAttribs.height) {
      height = parseInt(htmlAttribs.height, 10)
    }
    else {
      height = undefined
    }
  }

  return height
}

function _getWidthForIframe(htmlAttribs, passProps) {
  const { staticContextMaxWidth } = passProps
  let { width } = passProps

  if(!width) {
    if(staticContextMaxWidth) {
      width = staticContextMaxWidth
    } 
    else if(htmlAttribs.width) {
      width = parseInt(htmlAttribs.width, 10)
    }
    else {
      width = undefined
    }
  }

  return width
}


export function br (htlmAttribs, children, convertedCSSStyles, passProps) {
    return (
        <Text style={{ height: 1.2 * passProps.emSize, flex: 1 }} key={passProps.key}>{"\n"}</Text>
    );
}

export function textwrapper (htmlAttribs, children, convertedCSSStyles, { key }) {
    return (
        <Text key={key} style={convertedCSSStyles}>{ children }</Text>
    );
}
