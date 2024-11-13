import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import CN from 'classnames';
import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import ReactPlayer from 'react-player';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

var IconSuccess$1 = function (_a) {
    var _b = _a.color, color = _b === void 0 ? '#FFFFFF' : _b;
    return (jsxs("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [jsx("rect", { x: "0.9", y: "0.9", width: "22.2", height: "22.2", rx: "11.1", stroke: color, strokeWidth: "1.2" }), jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M16.256 8.84714C16.551 9.1583 16.551 9.6628 16.256 9.97396L11.5672 15.153C11.2722 15.4642 10.7939 15.4642 10.4989 15.153L8.23272 12.7627C7.93772 12.4515 7.93772 11.947 8.23272 11.6359C8.52772 11.3247 9.00601 11.3247 9.30101 11.6359L11.0331 13.4628L15.1877 8.84714C15.4827 8.53598 15.961 8.53598 16.256 8.84714Z", fill: color })] }));
};

var styles$8 = {"notification":"styles-module_notification__Naf24","notificationType":"styles-module_notificationType__Yv8Bk","notificationText":"styles-module_notificationText__A5OeF","typing":"styles-module_typing__fdgYF","blinkingPipe":"styles-module_blinkingPipe__0lo3H","blinkAnimation":"styles-module_blinkAnimation__-CmJK"};

var BorderNotification = function (_a) {
    var icon = _a.icon, text = _a.text;
    return (jsxs("div", { className: styles$8.notification, children: [jsx("div", { children: icon || jsx(IconSuccess$1, {}) }), jsx("div", { className: styles$8.notificationType, children: jsxs("p", { className: styles$8.notificationText, children: [text, " ", jsx("span", { className: styles$8.blinkingPipe, children: "|" })] }) })] }));
};

var styles$7 = {"container":"styles-module_container__H14Kq","content":"styles-module_content__SJehs","footer":"styles-module_footer__qXSdH","footerNavigate":"styles-module_footerNavigate__9LvQS","footerActions":"styles-module_footerActions__jQT3U","cube":"styles-module_cube__r88S9","circle":"styles-module_circle__y6x5f","circle1":"styles-module_circle1__cv4jF","moveCircle1":"styles-module_moveCircle1__4qh0e","circle2":"styles-module_circle2__KTnYl","moveCircle2":"styles-module_moveCircle2__XLoaR","circle3":"styles-module_circle3__a6Wi0","moveCircle3":"styles-module_moveCircle3__1TIzs","circle4":"styles-module_circle4__-9LUw","moveCircle4":"styles-module_moveCircle4__G8GqT"};

var circles = Array.from({ length: 4 }, function (_, index) { return index + 1; });
var Border = function (_a) {
    var children = _a.children, _b = _a.showCircles, showCircles = _b === void 0 ? true : _b, notification = _a.notification, containerClass = _a.containerClass, contentClass = _a.contentClass, footerClass = _a.footerClass, _c = _a.footerNavigate, footerNavigate = _c === void 0 ? [] : _c, _d = _a.footerActions, footerActions = _d === void 0 ? [] : _d;
    return (jsxs("div", { className: CN(styles$7.container, containerClass), children: [jsxs("div", { className: CN(styles$7.content, contentClass), children: [showCircles &&
                        circles.map(function (circle) { return (jsx("div", { className: "".concat(styles$7.cube, " ").concat(styles$7["circle".concat(circle)]), children: jsx("div", { className: "".concat(styles$7.circle) }) }, circle)); }), children] }), jsxs("footer", { className: CN(styles$7.footer, footerClass), children: [jsx("div", { className: styles$7.footerNavigate, children: footerNavigate.map(function (item, index) { return (jsx("div", { children: item }, index)); }) }), (notification === null || notification === void 0 ? void 0 : notification.text) && jsx(BorderNotification, __assign({}, notification)), jsx("div", { className: styles$7.footerActions, children: footerActions.map(function (item, index) { return (jsx("div", { children: item }, index)); }) })] })] }));
};

var styles$6 = {"button":"styles-module_button__Sh-fr","outlined":"styles-module_outlined__ycN37","error":"styles-module_error__R0GCe","active":"styles-module_active__xr3NY","warning":"styles-module_warning__iMXQa","text":"styles-module_text__ggH5t"};

var Button = function (_a) {
    var _b = _a.variant, variant = _b === void 0 ? 'outlined' : _b, _c = _a.type, type = _c === void 0 ? 'default' : _c, _d = _a.disabled, disabled = _d === void 0 ? false : _d, icon = _a.icon, text = _a.text, onClick = _a.onClick, buttonClass = _a.buttonClass, textClass = _a.textClass;
    return (jsxs("button", { onClick: onClick, disabled: disabled, className: CN(styles$6.button, styles$6[variant], styles$6[type], buttonClass), children: [icon && jsx(Fragment, { children: icon }), text && jsx("span", { className: CN(styles$6.text, textClass), children: text })] }));
};

var IconAttach = function () {
    return (jsxs("svg", { xmlns: 'http://www.w3.org/2000/svg', width: '25', height: '25', fill: 'none', children: [jsx("mask", { id: 'a', width: '25', height: '25', x: '0', y: '0', maskUnits: 'userSpaceOnUse', children: jsx("path", { fill: '#D9D9D9', d: 'M0 0h25v25H0z' }) }), jsx("g", { mask: 'url(#a)', children: jsx("path", { fill: '#242424', d: 'M18.875 16.723c0 1.683-.58 3.115-1.739 4.296-1.158 1.182-2.575 1.772-4.25 1.772-1.676 0-3.097-.59-4.263-1.772-1.166-1.181-1.748-2.613-1.748-4.296v-9.7c0-1.176.403-2.175 1.211-2.998.808-.822 1.8-1.234 2.974-1.234 1.174 0 2.165.412 2.973 1.234.808.823 1.212 1.822 1.212 2.997v9.188c0 .652-.228 1.214-.683 1.686a2.224 2.224 0 0 1-1.663.707 2.321 2.321 0 0 1-1.688-.696 2.292 2.292 0 0 1-.707-1.697V6.98h1.11v9.23c0 .355.122.657.365.907a1.2 1.2 0 0 0 .896.375 1.2 1.2 0 0 0 .895-.375c.243-.25.364-.552.364-.907V7c-.004-.863-.3-1.595-.89-2.196-.588-.601-1.317-.902-2.184-.902-.861 0-1.589.305-2.184.913-.594.608-.891 1.344-.891 2.207v9.7c-.004 1.373.47 2.542 1.424 3.508.954.967 2.115 1.45 3.484 1.45 1.35 0 2.497-.483 3.441-1.45.945-.966 1.422-2.135 1.43-3.507V6.979h1.11v9.744Z' }) })] }));
};

var IconRecord = function () {
    return (jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "22", height: "22", fill: "none", children: [jsx("circle", { cx: "11.317", cy: "11", r: "9.432", fill: "red" }), jsx("circle", { cx: "11.318", cy: "11", r: "10.326", stroke: "red", strokeWidth: ".199" }), jsx("path", { fill: "#fff", d: "M7.842 7.525h6.95v6.95h-6.95z" })] }));
};

var IconSend = function () {
    return (jsxs("svg", { width: '25', height: '25', viewBox: '0 0 25 25', fill: 'none', xmlns: 'http://www.w3.org/2000/svg', children: [jsx("mask", { id: 'mask0_469_4340', maskUnits: 'userSpaceOnUse', x: '0', y: '0', width: '25', height: '25', children: jsx("rect", { width: '25', height: '25', fill: '#D9D9D9' }) }), jsx("g", { mask: 'url(#mask0_469_4340)', children: jsx("path", { d: 'M2.67986 21.9583L13 4.08333L23.3201 21.9583H2.67986Z', stroke: 'currentColor', strokeWidth: '1.08333' }) })] }));
};

var styles$5 = {"inputWrapper":"styles-module_inputWrapper__6vUdk","inputComponent":"styles-module_inputComponent__8ULqQ","inputComponentActive":"styles-module_inputComponentActive__ldDBN","input":"styles-module_input__KRJnF","input-studio":"styles-module_input-studio__-bfAV","inputActions":"styles-module_inputActions__xtKuj","inputAction":"styles-module_inputAction__wjTVg","triangle":"styles-module_triangle__-PPDb","square":"styles-module_square__85VSF","inputActionActive":"styles-module_inputActionActive__Aq4eV","seconds":"styles-module_seconds__sOs-a","triangleToSquare":"styles-module_triangleToSquare__w8UA2","hideTriangle":"styles-module_hideTriangle__9-0bG","showSquare":"styles-module_showSquare__eBMn-","squareToTriangle":"styles-module_squareToTriangle__h2Jjg","showTriangle":"styles-module_showTriangle__fl7CI","hideSquare":"styles-module_hideSquare__pwV58","openDropdownTriangle":"styles-module_openDropdownTriangle__Ob9ZM","closeDropdownTriangle":"styles-module_closeDropdownTriangle__zdivy"};

var formatSecondsToString = function (seconds) {
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = seconds % 60;
    return "".concat(String(minutes).padStart(2, '0'), ":").concat(String(remainingSeconds).padStart(2, '0'));
};
var Input = function (_a) {
    var value = _a.value, onChange = _a.onChange, handlerValue = _a.handlerValue, placeholder = _a.placeholder, inputClass = _a.inputClass, inputRef = _a.inputRef, startRecord = _a.startRecord, handleStopRecord = _a.handleStopRecord, neyraWrites = _a.neyraWrites, cancelRequestToNeyra = _a.cancelRequestToNeyra;
    var _b = useState(false), isFocus = _b[0], setIsFocus = _b[1];
    var _c = useState(0), seconds = _c[0], setSeconds = _c[1];
    var _d = useState(null), intervalId = _d[0], setIntervalId = _d[1];
    var _e = useState(true), disabledAnimation = _e[0], setDisabledAnimation = _e[1];
    useEffect(function () {
        neyraWrites && setDisabledAnimation(false);
    }, [neyraWrites]);
    useEffect(function () {
        return function () {
            if (intervalId) {
                clearInterval(intervalId);
                setSeconds(0);
            }
        };
    }, [intervalId]);
    useEffect(function () {
        if (startRecord && !intervalId) {
            var interval = setInterval(function () {
                setSeconds(function (prevSeconds) { return prevSeconds + 1; });
            }, 1000);
            setIntervalId(interval);
        }
        else if (!startRecord && intervalId) {
            clearInterval(intervalId);
            setSeconds(0);
            setIntervalId(null);
        }
    }, [startRecord, intervalId]);
    var sendMessage = function () {
        if (neyraWrites && cancelRequestToNeyra) {
            cancelRequestToNeyra();
        }
        value && handlerValue(value);
    };
    var handleKeyPress = function (e) {
        var enterKey = e.key === 'Enter' || e.keyCode === 13 || e.code === 'NumpadEnter';
        enterKey && sendMessage();
    };
    return (jsx("div", { className: styles$5.inputWrapper, children: jsxs("div", { className: CN(styles$5.inputComponent, isFocus && styles$5.inputComponentActive, inputClass), children: [startRecord ? (jsx("p", { className: styles$5.seconds, children: formatSecondsToString(seconds) })) : (jsx("input", { ref: inputRef, placeholder: placeholder, className: styles$5.input, onChange: onChange, value: value, onKeyPress: handleKeyPress, onBlur: function () {
                        setIsFocus(false);
                    }, onFocus: function () {
                        setIsFocus(true);
                    } })), jsxs("div", { className: styles$5.inputActions, children: [jsx("button", { className: styles$5.inputAction, children: jsx(IconAttach, {}) }), startRecord ? (jsx("button", { onClick: handleStopRecord, className: styles$5.inputAction, children: jsx(IconRecord, {}) })) : (jsxs("button", { onClick: sendMessage, className: CN(styles$5.inputAction, value && styles$5.inputActionActive, !disabledAnimation &&
                                (neyraWrites
                                    ? styles$5.triangleToSquare
                                    : styles$5.squareToTriangle)), children: [jsx("div", { className: styles$5.triangle, children: jsx(IconSend, {}) }), jsx("div", { className: styles$5.square })] }))] })] }) }));
};

var styles$4 = {"sidebar":"styles-module_sidebar__vMq9h","hideSidebar":"styles-module_hideSidebar__hVurn"};

var Sidebar = function (_a) {
    var children = _a.children, _b = _a.open, open = _b === void 0 ? true : _b, sidebarClass = _a.sidebarClass;
    return (jsx("div", { className: CN(styles$4.sidebar, !open && styles$4.hideSidebar, sidebarClass), children: children }));
};

var styles$3 = {"sidebar":"styles-module_sidebar__fj2xg","disabled":"styles-module_disabled__bjjDV","icon":"styles-module_icon__7zFGn","text":"styles-module_text__l188O","additionalText":"styles-module_additionalText__XDAOj"};

var SidebarBlock = function (_a) {
    var icon = _a.icon, text = _a.text, additionalText = _a.additionalText, disabled = _a.disabled, onClick = _a.onClick, onIconClick = _a.onIconClick, onAdditionalTextClick = _a.onAdditionalTextClick, blockClass = _a.blockClass, iconClass = _a.iconClass, textClass = _a.textClass, additionalTextClass = _a.additionalTextClass;
    var handleClick = function (e) {
        !disabled && onClick && onClick(e);
    };
    return (jsxs("div", { className: CN(styles$3.sidebar, blockClass, disabled && styles$3.disabled), onClick: handleClick, children: [icon && (jsx("span", { className: CN(styles$3.icon, iconClass), onClick: onIconClick, children: icon })), text && jsx("span", { className: CN(styles$3.text, textClass), children: text }), additionalText && (jsx("div", { className: CN(styles$3.additionalText, additionalTextClass), onClick: onAdditionalTextClick, children: additionalText }))] }));
};

var IconCircle = function (_a) {
    var className = _a.className;
    return (jsx("svg", { width: "19", height: "20", viewBox: "0 0 19 20", fill: "none", xmlns: "http://www.w3.org/2000/svg", className: className, children: jsx("circle", { cx: "9.42871", cy: "10", r: "8.87939", stroke: "currentColor" }) }));
};

var IconPlus = function () {
    return (jsx("svg", { width: "14", height: "14", viewBox: "0 0 14 14", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: jsx("path", { d: "M6.29932 7.74995H0.549316L0.549316 6.25H6.29932V0.5L7.79927 0.5V6.25L13.5493 6.25V7.74995L7.79927 7.74995L7.79927 13.5H6.29932L6.29932 7.74995Z", fill: "white" }) }));
};

var IconTriangle = function () {
    return (jsxs("svg", { width: "22", height: "22", viewBox: "0 0 22 22", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [jsx("mask", { id: "mask0_927_5130", maskUnits: "userSpaceOnUse", x: "0", y: "0", width: "22", height: "22", children: jsx("rect", { y: "0.475586", width: "21.0493", height: "21.0493", fill: "#D9D9D9" }) }), jsx("g", { mask: "url(#mask0_927_5130)", children: jsx("path", { d: "M2.40463 18.0365L10.9456 3.243L19.4867 18.0365H2.40463Z", stroke: "white", strokeWidth: "1.08333" }) })] }));
};

var styles$2 = {"wrapper":"styles-module_wrapper__COcUu","userMessage":"styles-module_userMessage__q1-j8","messageContainer":"styles-module_messageContainer__Li7KP","wafeSurfer":"styles-module_wafeSurfer__IG8HL","text":"styles-module_text__1GGaV","footer":"styles-module_footer__oiTkf","blockButtons":"styles-module_blockButtons__5zUgG","button":"styles-module_button__w6e8j","timeStamp":"styles-module_timeStamp__1TTGQ","copyIcon":"styles-module_copyIcon__HIid4","copyIconActive":"styles-module_copyIconActive__naWzZ"};

var ChatMessage = function (_a) {
    var message = _a.message, handleTriangle = _a.handleTriangle, handleOnPage = _a.handleOnPage, handleCopyText = _a.handleCopyText, disabledButtons = _a.disabledButtons, messageClass = _a.messageClass, WafeSurferComponent = _a.WafeSurferComponent;
    var _b = useState(false), isCopy = _b[0], setIsCopy = _b[1];
    var id = message.id, isNeyro = message.isNeyro, text = message.text, timeStamp = message.timeStamp, voice = message.voice, blob = message.blob;
    useEffect(function () {
        if (isCopy) {
            var timer_1 = setTimeout(function () {
                setIsCopy(false);
            }, 2000);
            return function () {
                clearTimeout(timer_1);
            };
        }
    }, [isCopy]);
    var onCopy = function (e) {
        setIsCopy(true);
        navigator.clipboard.writeText(text);
        handleCopyText(e);
    };
    return (jsx("div", { id: id, className: CN(styles$2.wrapper, !isNeyro && styles$2.userMessage, messageClass), children: jsxs("div", { className: "".concat(styles$2.messageContainer, " ").concat(voice && blob ? styles$2.wafeSurfer : ''), children: [jsx("div", { children: voice && blob ? (WafeSurferComponent) : (jsx("p", { className: styles$2.text, children: text })) }), jsxs("div", { className: styles$2.footer, children: [jsx("div", { children: isNeyro && (jsxs("div", { className: styles$2.blockButtons, children: [jsx("button", { className: styles$2.button, onClick: handleTriangle, disabled: disabledButtons === null || disabledButtons === void 0 ? void 0 : disabledButtons.includes('triangle'), children: jsx(IconTriangle, {}) }), jsx("button", { onClick: handleOnPage, className: styles$2.button, disabled: disabledButtons === null || disabledButtons === void 0 ? void 0 : disabledButtons.includes('plus'), children: jsx(IconPlus, {}) }), jsx("button", { className: styles$2.button, onClick: onCopy, disabled: disabledButtons === null || disabledButtons === void 0 ? void 0 : disabledButtons.includes('circle'), children: jsx(IconCircle, { className: CN(styles$2.copyIcon, isCopy && styles$2.copyIconActive) }) })] })) }), jsx("div", { className: styles$2.timeStamp, children: timeStamp })] })] }) }));
};

var IconDelete = function () {
    return (jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", children: [jsx("mask", { id: "mask0_472_1093", maskUnits: "userSpaceOnUse", x: "0", y: "0", width: "24", height: "24", children: jsx("rect", { width: "24", height: "24", fill: "#D9D9D9" }) }), jsx("g", { mask: "url(#mask0_472_1093)", children: jsx("path", { d: "M9.4999 17.7C9.13324 17.7 8.7874 17.6167 8.4624 17.45C8.1374 17.2833 7.86657 17.05 7.6499 16.75L4.9249 12.875C4.74157 12.6083 4.6499 12.3167 4.6499 12C4.6499 11.6833 4.74157 11.3917 4.9249 11.125L7.6499 7.29999C7.86657 6.99999 8.13324 6.75832 8.4499 6.57499C8.76657 6.39165 9.11657 6.29999 9.4999 6.29999H18.1999C18.6166 6.29999 18.9707 6.44582 19.2624 6.73749C19.5541 7.02915 19.6999 7.38332 19.6999 7.79999V16.2C19.6999 16.6167 19.5541 16.9708 19.2624 17.2625C18.9707 17.5542 18.6166 17.7 18.1999 17.7H9.4999ZM9.4999 17H18.1999C18.3999 17 18.5832 16.9167 18.7499 16.75C18.9166 16.5833 18.9999 16.4 18.9999 16.2V7.79999C18.9999 7.59999 18.9166 7.41665 18.7499 7.24999C18.5832 7.08332 18.3999 6.99999 18.1999 6.99999H9.4999C9.2499 6.99999 9.0124 7.06249 8.7874 7.18749C8.5624 7.31249 8.38324 7.46665 8.2499 7.64999L5.4749 11.525C5.3749 11.6583 5.3249 11.8167 5.3249 12C5.3249 12.1833 5.3749 12.3417 5.4749 12.475L8.2499 16.35C8.38324 16.5333 8.5624 16.6875 8.7874 16.8125C9.0124 16.9375 9.2499 17 9.4999 17ZM13.5499 12.5L15.8999 14.85C15.9666 14.9167 16.0457 14.9542 16.1374 14.9625C16.2291 14.9708 16.3166 14.9333 16.3999 14.85C16.4832 14.7667 16.5249 14.6833 16.5249 14.6C16.5249 14.5167 16.4832 14.4333 16.3999 14.35L14.0499 12L16.3999 9.64999C16.4666 9.58332 16.5041 9.50415 16.5124 9.41249C16.5207 9.32082 16.4832 9.23332 16.3999 9.14999C16.3166 9.06665 16.2332 9.02499 16.1499 9.02499C16.0666 9.02499 15.9832 9.06665 15.8999 9.14999L13.5499 11.5L11.1999 9.14999C11.1332 9.08332 11.0541 9.04582 10.9624 9.03749C10.8707 9.02915 10.7832 9.06665 10.6999 9.14999C10.6166 9.23332 10.5749 9.31665 10.5749 9.39999C10.5749 9.48332 10.6166 9.56665 10.6999 9.64999L13.0499 12L10.6999 14.35C10.6332 14.4167 10.5957 14.4958 10.5874 14.5875C10.5791 14.6792 10.6166 14.7667 10.6999 14.85C10.7832 14.9333 10.8666 14.975 10.9499 14.975C11.0332 14.975 11.1166 14.9333 11.1999 14.85L13.5499 12.5Z", fill: "currentColor" }) })] }));
};

var styles$1 = {"chatBlock":"styles-module_chatBlock__1iRqj","chatCircleIcon":"styles-module_chatCircleIcon__7fOr2","blockContainer":"styles-module_blockContainer__KgxUM"};

var ChatBlock = function (_a) {
    var uid = _a.uid, title = _a.title, handleClick = _a.handleClick, handleIconClick = _a.handleIconClick;
    return (jsxs("div", { className: styles$1.chatBlock, onClick: function () {
            handleClick(uid);
        }, children: [jsxs("div", { className: styles$1.blockContainer, children: [jsx("div", { className: styles$1.chatCircleIcon }), jsx("span", { className: styles$1.title, children: title })] }), jsx("div", { onClick: function () {
                    handleIconClick && handleIconClick(uid);
                }, children: jsx(IconDelete, {}) })] }));
};

var IconSmallLogo = function () {
    return (jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "55", height: "37", viewBox: "0 0 55 37", fill: "none", children: [jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M27.6752 4.31923C24.7731 6.13813 22.515 8.82195 21.2193 11.9924L21.7766 12.2201C23.0246 9.16637 25.1996 6.58132 27.9949 4.82935C30.7902 3.07738 34.0648 2.24685 37.3572 2.45485C40.6496 2.66284 43.7937 3.89887 46.3463 5.98868C48.8988 8.0785 50.7312 10.9167 51.585 14.1033C52.4389 17.2898 52.2711 20.6639 51.1054 23.7501C49.9397 26.8362 47.8349 29.4787 45.0876 31.305C42.3403 33.1313 39.0891 34.0494 35.7924 33.9298C32.4956 33.8102 29.3195 32.659 26.7118 30.6384L26.343 31.1143C29.0504 33.212 32.3478 34.4073 35.7705 34.5314C39.1933 34.6556 42.5687 33.7024 45.4209 31.8063C48.2731 29.9103 50.4584 27.1668 51.6686 23.9628C52.8788 20.7588 53.053 17.2557 52.1665 13.9474C51.2801 10.6392 49.3777 7.69251 46.7276 5.52286C44.0775 3.3532 40.8133 2.06996 37.3952 1.85402C33.977 1.63807 30.5773 2.50033 27.6752 4.31923ZM25.2192 29.8058C25.2147 29.9608 25.3508 30.0929 25.5231 30.1008C25.6955 30.1087 25.8389 29.9895 25.8434 29.8345C25.8479 29.6795 25.7119 29.5474 25.5395 29.5395C25.3671 29.5316 25.2237 29.6509 25.2192 29.8058ZM23.0849 27.4249C22.8436 27.4138 22.6531 27.2289 22.6594 27.012C22.6658 26.795 22.8665 26.628 23.1078 26.6391C23.3491 26.6502 23.5396 26.8351 23.5333 27.052C23.527 27.269 23.3262 27.4359 23.0849 27.4249ZM20.7097 23.3719C20.7006 23.6819 20.9727 23.946 21.3175 23.9618C21.6622 23.9776 21.949 23.7392 21.958 23.4292C21.9671 23.1192 21.6949 22.8551 21.3502 22.8393C21.0055 22.8235 20.7187 23.062 20.7097 23.3719ZM20.447 20.0557C20.0334 20.0368 19.7068 19.7198 19.7177 19.3479C19.7285 18.9759 20.0726 18.6898 20.4863 18.7087C20.9 18.7277 21.2266 19.0446 21.2157 19.4166C21.2049 19.7885 20.8607 20.0747 20.447 20.0557ZM20.5993 15.9481C20.1511 15.9276 19.7973 15.5843 19.8091 15.1813C19.8208 14.7783 20.1937 14.4683 20.6418 14.4889C21.09 14.5095 21.4438 14.8528 21.432 15.2557C21.4202 15.6587 21.0474 15.9687 20.5993 15.9481Z", fill: "currentColor", fillOpacity: "0.5" }), jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M17.3069 1.80365C20.7303 1.91111 24.0337 3.0903 26.7513 5.17499L26.3849 5.65269C23.7672 3.64472 20.5854 2.50892 17.288 2.40542C13.9905 2.30192 10.7438 3.23593 8.00536 5.07579C5.26696 6.91565 3.17507 9.56856 2.02457 12.6605C0.874075 15.7525 0.723008 19.1276 1.59267 22.3099C2.46232 25.4923 4.30884 28.3215 6.87192 30.3987C9.43499 32.4758 12.5853 33.6962 15.8788 33.8877C19.1724 34.0792 22.4429 33.2322 25.2295 31.4661C28.016 29.7 30.178 27.1039 31.4106 24.0438L31.9691 24.2687C30.6893 27.4458 28.4448 30.1411 25.5518 31.9746C22.6588 33.8082 19.2632 34.6875 15.8439 34.4887C12.4246 34.2899 9.15384 33.0229 6.49285 30.8664C3.83185 28.7099 1.91478 25.7726 1.0119 22.4687C0.109015 19.1647 0.265854 15.6607 1.4603 12.4506C2.65476 9.24047 4.82657 6.4862 7.66959 4.57605C10.5126 2.6659 13.8834 1.6962 17.3069 1.80365ZM28.1007 6.70219C28.1106 6.54746 27.9791 6.41078 27.8071 6.39692C27.6351 6.38306 27.4877 6.49726 27.4778 6.652C27.468 6.80674 27.5994 6.94341 27.7714 6.95727C27.9434 6.97113 28.0908 6.85693 28.1007 6.70219ZM30.1511 9.1557C30.3919 9.1751 30.5759 9.36645 30.562 9.58308C30.5482 9.79971 30.3418 9.95959 30.101 9.94019C29.8602 9.92078 29.6762 9.72944 29.6901 9.51281C29.7039 9.29618 29.9103 9.13629 30.1511 9.1557ZM32.3849 13.2887C32.4047 12.9792 32.1419 12.7059 31.7979 12.6782C31.4539 12.6504 31.159 12.8788 31.1393 13.1883C31.1195 13.4978 31.3824 13.7711 31.7263 13.7989C32.0703 13.8266 32.3652 13.5982 32.3849 13.2887ZM32.5324 16.6118C32.9452 16.6451 33.2606 16.9731 33.2369 17.3445C33.2132 17.7159 32.8594 17.99 32.4466 17.9567C32.0338 17.9234 31.7184 17.5954 31.7421 17.224C31.7658 16.8527 32.1197 16.5786 32.5324 16.6118ZM32.2386 20.7115C32.6858 20.7476 33.0275 21.1029 33.0018 21.5052C32.9761 21.9075 32.5928 22.2045 32.1456 22.1684C31.6984 22.1324 31.3568 21.777 31.3824 21.3747C31.4081 20.9724 31.7914 20.6755 32.2386 20.7115Z", fill: "currentColor", fillOpacity: "0.5" })] }));
};

var styles = {"logo":"styles-module_logo__3Olk-"};

var SmallLogo = function (_a) {
    var onClick = _a.onClick, disabled = _a.disabled, logoClass = _a.logoClass;
    return (jsx("button", { onClick: onClick, disabled: disabled || !onClick, className: CN(styles.logo, logoClass), children: jsx(IconSmallLogo, {}) }));
};

var IconAlert = function (_a) {
    var _b = _a.color, color = _b === void 0 ? '#FFFFFF' : _b;
    return (jsxs("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [jsx("rect", { x: "0.9", y: "0.9", width: "22.2", height: "22.2", rx: "11.1", stroke: "white", strokeWidth: "1.2" }), jsx("path", { d: "M8.82364 15.176C8.9411 15.2935 9.09281 15.3522 9.24942 15.3522C9.40603 15.3522 9.55774 15.2935 9.67519 15.176L12.0047 12.8465L14.3342 15.176C14.4517 15.2935 14.6034 15.3522 14.76 15.3522C14.9166 15.3522 15.0683 15.2935 15.1858 15.176C15.4207 14.9411 15.4207 14.5643 15.1858 14.3293L12.8465 11.9998L15.176 9.6703C15.4109 9.43539 15.4109 9.05855 15.176 8.82364C14.9411 8.58873 14.5643 8.58873 14.3294 8.82364L11.9998 11.1532L9.6703 8.82364C9.43539 8.58873 9.05855 8.58873 8.82364 8.82364C8.58873 9.05855 8.58873 9.43539 8.82364 9.6703L11.1532 11.9998L8.82364 14.3293C8.58873 14.5643 8.58873 14.9411 8.82364 15.176Z", fill: color })] }));
};

var IconWarning = function (_a) {
    var _b = _a.color, color = _b === void 0 ? '#FFFFFF' : _b;
    return (jsx("svg", { width: "32", height: "32", viewBox: "0 0 32 32", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: jsx("g", { mask: "url(#mask0_19800_15251)", children: jsx("path", { d: "M16 21.2336C16.1781 21.2336 16.3392 21.1669 16.4832 21.0336C16.6283 20.9003 16.7008 20.7333 16.7008 20.5328C16.7008 20.3557 16.6283 20.2005 16.4832 20.0672C16.3392 19.9339 16.1781 19.8672 16 19.8672C15.8219 19.8672 15.6608 19.9339 15.5168 20.0672C15.3717 20.2005 15.2992 20.3557 15.2992 20.5328C15.2992 20.7333 15.3717 20.9003 15.5168 21.0336C15.6608 21.1669 15.8219 21.2336 16 21.2336ZM15.4672 18.2H16.5328V10.0992H15.4672V18.2ZM11.9328 25.8672L6.13281 20.0336V11.9328L11.9328 6.13281H20.0672L25.8672 11.9328V20.0672L20.0336 25.8672H11.9328ZM12.3664 24.8H19.6336L24.8 19.6336V12.3664L19.6 7.20001H12.3664L7.20001 12.3664V19.6336L12.3664 24.8Z", fill: color }) }) }));
};

var IconSuccess = function (_a) {
    var _b = _a.color, color = _b === void 0 ? '#FFFFFF' : _b;
    return (jsxs("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [jsx("rect", { x: "0.9", y: "0.9", width: "22.2", height: "22.2", rx: "11.1", stroke: color, strokeWidth: "1.2" }), jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M16.256 8.84714C16.551 9.1583 16.551 9.6628 16.256 9.97396L11.5672 15.153C11.2722 15.4642 10.7939 15.4642 10.4989 15.153L8.23272 12.7627C7.93772 12.4515 7.93772 11.947 8.23272 11.6359C8.52772 11.3247 9.00601 11.3247 9.30101 11.6359L11.0331 13.4628L15.1877 8.84714C15.4827 8.53598 15.961 8.53598 16.256 8.84714Z", fill: color })] }));
};

var IconNotification = function (_a) {
    var _b = _a.color, color = _b === void 0 ? '#FFFFFF' : _b;
    return (jsxs("svg", { width: "18", height: "24", viewBox: "0 0 18 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [jsx("path", { d: "M14 13.2133V4.5C14 4.3672 13.9473 4.24022 13.8535 4.14647L9.8535 0.146484C9.75975 0.0527344 9.63281 0 9.49997 0H1.99997C0.897469 0 0 0.896953 0 2.00002V17C0 18.103 0.897469 19 2.00002 19H7.02534C7.27917 21.7989 9.63652 24 12.5 24C15.5322 24 18 21.5327 18 18.5C18 15.9878 16.3048 13.8685 14 13.2133ZM9.99998 1.70705L12.293 4.00003H11C10.4482 4.00003 10 3.5513 10 3.00005V1.70705H9.99998ZM2.00002 18C1.44825 18 1.00003 17.5513 1.00003 17V2.00002C1.00003 1.44877 1.4483 1.00003 2.00002 1.00003H9V3C9 4.10302 9.89747 5.00002 11 5.00002H13V13.0253C12.8351 13.0104 12.6688 13 12.5 13C9.63656 13 7.27917 15.2011 7.02534 18H2.00002V18ZM12.5 23C10.0185 23 8.00002 20.9814 8.00002 18.5C8.00002 16.0186 10.0186 14 12.5 14C14.9814 14 17 16.0186 17 18.5C17 20.9814 14.9814 23 12.5 23Z", fill: color }), jsx("path", { d: "M14.6465 16.6465L11.5 19.793L10.3535 18.6465C10.1582 18.4512 9.84178 18.4512 9.6465 18.6465C9.45117 18.8418 9.45117 19.1582 9.6465 19.3535L11.1465 20.8535C11.2441 20.9512 11.3721 21 11.5 21C11.628 21 11.7559 20.9512 11.8536 20.8535L15.3536 17.3535C15.5489 17.1582 15.5489 16.8418 15.3536 16.6465C15.1582 16.4512 14.8418 16.4512 14.6465 16.6465Z", fill: color })] }));
};

var IconClose = function () {
    return (jsx("svg", { width: "14", height: "14", viewBox: "0 0 14 14", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: jsx("path", { d: "M13 1L1 13M12.9896 12.9896L1.01036 1.01039", stroke: "currentColor", strokeWidth: "1.2", strokeLinecap: "round" }) }));
};

var DEFAULT_DURATION = 5000;
var NOTIFICATION_ICON = {
    alert: IconAlert,
    warning: IconWarning,
    success: IconSuccess,
    default: IconNotification,
};
var NotificationItem = function (_a) {
    var _b, _c;
    var notification = _a.notification, removeItem = _a.removeItem;
    var message = notification.message, showButtons = notification.showButtons, acceptMessage = notification.acceptMessage, acceptHandler = notification.acceptHandler, cancelMessage = notification.cancelMessage, cancelHandler = notification.cancelHandler, hideIcon = notification.hideIcon, type = notification.type, width = notification.width, merged = notification.merged;
    var Icon = type && Object.prototype.hasOwnProperty.call(NOTIFICATION_ICON, type)
        ? NOTIFICATION_ICON[type]
        : NOTIFICATION_ICON.default;
    useLayoutEffect(function () {
        var timer = setTimeout(function () {
            removeItem(notification);
        }, DEFAULT_DURATION);
        return function () { return clearTimeout(timer); };
    });
    var closeNotification = function () {
        removeItem(notification);
    };
    return (jsxs("div", { className: "notifications-item", style: { width: width }, "data-test": "toster_container", children: [jsx("div", { className: CN('notifications-item-icon', type, (_b = {},
                    _b['notifications-item-merged'] = merged,
                    _b)), children: !hideIcon && jsx(Icon, {}) }), jsx("div", { className: CN('notifications-item-message', (_c = {},
                    _c['notifications-item-merged'] = merged,
                    _c)), "data-test": "toster_message", children: message }), showButtons && acceptMessage && (jsx("button", { className: "link link--shrink notifications-accept", onClick: acceptHandler, "data-test": "toster_accept_message_button", children: acceptMessage })), showButtons && cancelMessage && (jsx("button", { className: "link link--shrink notifications-cancel", onClick: cancelHandler, "data-test": "toster_cancel_message_button", children: cancelMessage })), jsx("button", { type: "button", className: "notifications-close", onClick: closeNotification, "data-test": "toster_close_button", children: jsx(IconClose, {}) })] }));
};

var NotificationBubble = function (_a) {
    var notifications = _a.notifications, removeNotification = _a.removeNotification;
    var removeItem = function (notification) {
        removeNotification(notification);
    };
    var notificationItems = notifications.map(function (notification) { return (jsx(CSSTransition, { classNames: "notification-item", timeout: 0, children: jsx(NotificationItem, { notification: notification, removeItem: removeItem }) }, "notification-item-".concat(notification.id))); });
    return (jsx(TransitionGroup, { className: "notifications-container", children: notificationItems }));
};

var MessageType;
(function (MessageType) {
    MessageType["VIDEO_ERROR"] = "VIDEO_ERROR";
    MessageType["AUDIO_ERROR"] = "AUDIO_ERROR";
    MessageType["API_URL_SAVED"] = "API_URL_SAVED";
    MessageType["API_URL_SAVE_FAILED"] = "API_URL_SAVE_FAILED";
    MessageType["CACHE_CLEARED"] = "CACHE_CLEARED";
})(MessageType || (MessageType = {}));

var generateVideoUrl = function (slug, decryptionKey) {
    var baseUrl = 'non-existent-url/video.mp4';
    var queryParams = new URLSearchParams({
        slug: slug,
        key: decryptionKey || '',
    });
    return "".concat(baseUrl, "?").concat(queryParams.toString());
};
var cacheCleared$1 = false;
var VideoPlayer = function (_a) {
    var slug = _a.slug, decryptionKey = _a.decryptionKey, apiUrl = _a.apiUrl, _b = _a.playing, playing = _b === void 0 ? true : _b, _c = _a.loop, loop = _c === void 0 ? false : _c, _d = _a.muted, muted = _d === void 0 ? false : _d, _e = _a.controls, controls = _e === void 0 ? true : _e, _f = _a.playsinline, playsinline = _f === void 0 ? true : _f, _g = _a.width, width = _g === void 0 ? '100%' : _g, _h = _a.height, height = _h === void 0 ? '100%' : _h, onPlay = _a.onPlay, onPause = _a.onPause, onEnded = _a.onEnded, onError = _a.onError, onReady = _a.onReady, onProgress = _a.onProgress, _j = _a.className, className = _j === void 0 ? '' : _j, videoRef = _a.videoRef, _k = _a.playerProps, playerProps = _k === void 0 ? {} : _k;
    var _l = useState(''), error = _l[0], setError = _l[1];
    var _m = useState(false), serviceWorkerReady = _m[0], setServiceWorkerReady = _m[1];
    var _o = useState(''), videoUrl = _o[0], setVideoUrl = _o[1];
    var _p = useState(false), apiUrlSaved = _p[0], setApiUrlSaved = _p[1];
    useEffect(function () {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker
                .register('service-worker.js')
                .then(function (registration) {
                if (registration.active) {
                    setServiceWorkerReady(true);
                }
                else {
                    registration.addEventListener('updatefound', function () {
                        var newWorker = registration.installing;
                        if (newWorker) {
                            newWorker.addEventListener('statechange', function () {
                                if (newWorker.state === 'activated') {
                                    setServiceWorkerReady(true);
                                }
                            });
                        }
                    });
                }
            })
                .catch(function (error) {
                console.error('Service Worker registration failed:', error);
                setError('Service Worker registration failed');
            });
            var handleMessage_1 = function (event) {
                var data = event.data;
                if (data) {
                    switch (data.type) {
                        case MessageType.VIDEO_ERROR:
                            setError(data.message);
                            break;
                        case MessageType.API_URL_SAVED:
                            setApiUrlSaved(true);
                            break;
                        case MessageType.API_URL_SAVE_FAILED:
                            console.log('Failed to save API URL:', data.message);
                            setError('An unexpected error occurred while playing the video.');
                            break;
                        case MessageType.CACHE_CLEARED:
                            cacheCleared$1 = true;
                            console.log('Cache has been cleared.');
                            break;
                    }
                }
            };
            navigator.serviceWorker.addEventListener('message', handleMessage_1);
            return function () {
                navigator.serviceWorker.removeEventListener('message', handleMessage_1);
            };
        }
        else {
            setError('Service Workers are not supported in this browser.');
        }
    }, []);
    useEffect(function () {
        var _a, _b;
        if (serviceWorkerReady) {
            if (!apiUrl) {
                setError('Backend url are required.');
                return;
            }
            !cacheCleared$1 &&
                ((_a = navigator.serviceWorker.controller) === null || _a === void 0 ? void 0 : _a.postMessage({
                    type: 'DELETE_EXPIRED_CACHE',
                }));
            (_b = navigator.serviceWorker.controller) === null || _b === void 0 ? void 0 : _b.postMessage({ apiUrl: apiUrl });
        }
    }, [apiUrl, serviceWorkerReady]);
    useEffect(function () {
        if (serviceWorkerReady && apiUrlSaved) {
            if (!slug) {
                setError('Slug is required.');
                return;
            }
            var newVideoUrl = generateVideoUrl(slug, decryptionKey);
            setVideoUrl(newVideoUrl);
            setError('');
        }
    }, [slug, decryptionKey, serviceWorkerReady, apiUrlSaved]);
    useEffect(function () {
        if (error) {
            onError === null || onError === void 0 ? void 0 : onError(error);
        }
    }, [error]);
    var handleError = function () {
        if (!videoUrl) {
            return;
        }
        setError('An unexpected error occurred while playing the video.');
    };
    if (!videoUrl) {
        return null;
    }
    return (jsx(ReactPlayer, __assign({ ref: videoRef, url: videoUrl, playing: playing, loop: loop, muted: muted, controls: controls, playsinline: playsinline, width: width, height: height, onPlay: onPlay, onPause: onPause, onEnded: onEnded, onError: handleError, onReady: onReady, onProgress: onProgress, className: className }, playerProps)));
};

var generateAudioUrl = function (slug, decryptionKey) {
    var baseUrl = 'non-existent-url/audio.mp3';
    var queryParams = new URLSearchParams({
        slug: slug,
        key: decryptionKey || '',
    });
    return "".concat(baseUrl, "?").concat(queryParams.toString());
};
var cacheCleared = false;
var AudioPlayer = function (_a) {
    var slug = _a.slug, decryptionKey = _a.decryptionKey, apiUrl = _a.apiUrl, audioRef = _a.audioRef, onEnded = _a.onEnded, onError = _a.onError, onLoadedMetadata = _a.onLoadedMetadata, onTimeUpdate = _a.onTimeUpdate, onCanPlay = _a.onCanPlay, _b = _a.controls, controls = _b === void 0 ? false : _b, _c = _a.loop, loop = _c === void 0 ? false : _c, _d = _a.muted, muted = _d === void 0 ? false : _d, _e = _a.autoplay, autoplay = _e === void 0 ? false : _e, _f = _a.className, className = _f === void 0 ? '' : _f;
    var _g = useState(''), error = _g[0], setError = _g[1];
    var _h = useState(false), serviceWorkerReady = _h[0], setServiceWorkerReady = _h[1];
    var _j = useState(''), audioUrl = _j[0], setAudioUrl = _j[1];
    var _k = useState(false), apiUrlSaved = _k[0], setApiUrlSaved = _k[1];
    useEffect(function () {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker
                .register('service-worker.js')
                .then(function (registration) {
                if (registration.active) {
                    setServiceWorkerReady(true);
                }
                else {
                    registration.addEventListener('updatefound', function () {
                        var newWorker = registration.installing;
                        if (newWorker) {
                            newWorker.addEventListener('statechange', function () {
                                if (newWorker.state === 'activated') {
                                    setServiceWorkerReady(true);
                                }
                            });
                        }
                    });
                }
            })
                .catch(function (error) {
                console.error('Service Worker registration failed:', error);
                setError('Service Worker registration failed');
            });
            var handleMessage_1 = function (event) {
                var data = event.data;
                if (data) {
                    switch (data.type) {
                        case MessageType.AUDIO_ERROR:
                            setError(data.message);
                            break;
                        case MessageType.API_URL_SAVED:
                            setApiUrlSaved(true);
                            break;
                        case MessageType.API_URL_SAVE_FAILED:
                            console.log('Failed to save API URL:', data.message);
                            setError('An unexpected error occurred while playing the audio.');
                            break;
                        case MessageType.CACHE_CLEARED:
                            cacheCleared = true;
                            console.log('Cache has been cleared.');
                            break;
                    }
                }
            };
            navigator.serviceWorker.addEventListener('message', handleMessage_1);
            return function () {
                navigator.serviceWorker.removeEventListener('message', handleMessage_1);
            };
        }
        else {
            setError('Service Workers are not supported in this browser.');
        }
    }, []);
    useEffect(function () {
        var _a, _b;
        if (serviceWorkerReady) {
            if (!apiUrl) {
                setError('Backend URL is required.');
                return;
            }
            !cacheCleared &&
                ((_a = navigator.serviceWorker.controller) === null || _a === void 0 ? void 0 : _a.postMessage({
                    type: 'DELETE_EXPIRED_CACHE',
                }));
            (_b = navigator.serviceWorker.controller) === null || _b === void 0 ? void 0 : _b.postMessage({ apiUrl: apiUrl });
        }
    }, [apiUrl, serviceWorkerReady]);
    useEffect(function () {
        if (serviceWorkerReady && apiUrlSaved) {
            if (!slug) {
                setError('Slug is required.');
                return;
            }
            var newAudioUrl = generateAudioUrl(slug, decryptionKey);
            setAudioUrl(newAudioUrl);
            setError('');
        }
    }, [slug, decryptionKey, serviceWorkerReady, apiUrlSaved]);
    useEffect(function () {
        if (error) {
            onError === null || onError === void 0 ? void 0 : onError(error);
        }
    }, [error]);
    var handleError = function () {
        if (!audioUrl) {
            return;
        }
        setError('An unexpected error occurred while playing the audio.');
    };
    if (!audioUrl) {
        return null;
    }
    return (jsx("audio", { src: audioUrl, ref: audioRef, onEnded: onEnded, onError: handleError, onLoadedMetadata: onLoadedMetadata, onTimeUpdate: onTimeUpdate, onCanPlay: onCanPlay, controls: controls, loop: loop, muted: muted, autoPlay: autoplay, className: className }));
};

var AudioSVGImage = function (_a) {
    var _b = _a.className, className = _b === void 0 ? '' : _b, _c = _a.color, color = _c === void 0 ? '#206ACF' : _c;
    return (jsxs("svg", { viewBox: "0 0 494 141", fill: "none", xmlns: "http://www.w3.org/2000/svg", className: className, children: [jsx("path", { d: "M2 56.3984V84.3848", stroke: "white", strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M9.69067 75.6283V65.1602", stroke: "white", strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M17.3818 74.344V66.4395", stroke: "white", strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M86.0303 74.344V66.4395", stroke: "white", strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M25.0728 72.8531V67.9395", stroke: "white", strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M32.7637 85.026V55.7578", stroke: "white", strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M40.312 99.7683V40.8047", stroke: "white", strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M48.0032 134.592V6.41016", stroke: "white", strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M55.6938 94.8544V45.9316", stroke: "white", strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M63.385 83.32V57.6836", stroke: "white", strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M71.0757 94.8544V45.9316", stroke: "white", strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M78.7666 77.9768V62.8086", stroke: "white", strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M94.1484 77.9768V62.8086", stroke: "white", strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M101.697 93.57V47.2109", stroke: "white", strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M155.818 77.548V63.2344", stroke: "white", strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M163.936 84.6011V56.1875", stroke: "white", strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M171.485 67.9395V72.8531", stroke: "white", strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M109.388 112.798V27.9844", stroke: "white", strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M117.079 87.162V53.6211", stroke: "white", strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M124.77 77.9768V62.8086", stroke: "white", strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M132.461 74.344V66.4395", stroke: "white", strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M179.603 84.6011V56.1875", stroke: "white", strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M187.152 113.228V27.7734", stroke: "white", strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M194.842 121.772V19.2266", stroke: "white", strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M202.533 141V0", stroke: "white", strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M210.224 121.772V19.2266", stroke: "white", strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M217.915 34.1797V106.816", stroke: "white", strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M140.152 93.57V47.2109", stroke: "white", strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M147.842 80.754V60.0312", stroke: "white", strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M227.03 44.2207V96.5616", stroke: "white", strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M234.721 53.4082V87.59", stroke: "white", strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M242.412 74.344V66.4395", stroke: "white", strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M311.061 83.32V57.6836", stroke: "white", strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M250.103 72.8531V67.9395", stroke: "white", strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M483.109 66.4395V74.344", stroke: "white", strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M473.994 53.6211V87.162", stroke: "white", strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M458.612 66.4395V74.344", stroke: "white", strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M257.794 85.026V55.7578", stroke: "white", strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M265.342 99.7683V40.8047", stroke: "white", strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M273.033 87.162V53.6211", stroke: "white", strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M280.724 94.8544V45.9316", stroke: "white", strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M288.415 112.798V27.9844", stroke: "white", strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M296.106 107.672V33.1133", stroke: "white", strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M303.797 99.982V40.8047", stroke: "white", strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M319.179 107.672V33.1133", stroke: "white", strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M326.727 121.772V19.2266", stroke: "white", strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M380.848 74.344V66.4395", stroke: "white", strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M388.967 77.9768V62.8086", stroke: "white", strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M396.515 69.2188V71.5688", stroke: "white", strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M491.655 69.2188V71.5688", stroke: "white", strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M466.018 77.9768V62.8086", stroke: "white", strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M450.352 69.2188V71.5688", stroke: "white", strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M334.418 141V0", stroke: "white", strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M342.109 107.672V33.1133", stroke: "white", strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M349.8 93.57V47.2109", stroke: "white", strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M357.491 80.754V60.0312", stroke: "white", strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M404.633 77.9768V62.8086", stroke: "white", strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M412.182 93.57V47.2109", stroke: "white", strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M419.873 79.2611V61.5293", stroke: "white", strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M427.564 87.162V53.6211", stroke: "white", strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M435.254 77.9768V62.8086", stroke: "white", strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M442.946 74.344V66.4395", stroke: "white", strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M365.182 93.57V47.2109", stroke: "white", strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M372.873 80.754V60.0312", stroke: "white", strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M2 56.3984V84.3848", stroke: color, strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M9.69067 75.6283V65.1602", stroke: color, strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M17.3818 74.344V66.4395", stroke: color, strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M86.0303 74.344V66.4395", stroke: color, strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M25.0728 72.8531V67.9395", stroke: color, strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M32.7637 85.026V55.7578", stroke: color, strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M40.312 99.7683V40.8047", stroke: color, strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M48.0032 134.592V6.41016", stroke: color, strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M55.6938 94.8544V45.9316", stroke: color, strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M63.385 83.32V57.6836", stroke: color, strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M71.0757 94.8544V45.9316", stroke: color, strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M78.7666 77.9768V62.8086", stroke: color, strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M94.1484 77.9768V62.8086", stroke: color, strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M101.697 93.57V47.2109", stroke: color, strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M155.818 77.548V63.2344", stroke: color, strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M163.936 84.6011V56.1875", stroke: color, strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M171.485 67.9395V72.8531", stroke: color, strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M109.388 112.798V27.9844", stroke: color, strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M117.079 87.162V53.6211", stroke: color, strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M124.77 77.9768V62.8086", stroke: color, strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M132.461 74.344V66.4395", stroke: color, strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M179.603 84.6011V56.1875", stroke: color, strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M187.152 113.228V27.7734", stroke: color, strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M194.842 121.772V19.2266", stroke: color, strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M202.533 141V0", stroke: color, strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M210.224 121.772V19.2266", stroke: color, strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M217.915 34.1797V106.816", stroke: color, strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M140.152 93.57V47.2109", stroke: color, strokeWidth: "3", strokeMiterlimit: "10" }), jsx("path", { d: "M147.842 80.754V60.0312", stroke: color, strokeWidth: "3", strokeMiterlimit: "10" })] }));
};

var PlayIcon = function () { return (jsx("svg", { viewBox: "0 0 12 16", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: jsx("path", { d: "M0 0L12 8L0 16V0Z", fill: "currentColor" }) })); };
var PauseIcon = function () { return jsx("span", { children: "||" }); };
var MutedVolumeIcon = function () { return (jsx("svg", { xmlns: "http://www.w3.org/2000/svg", "aria-hidden": "true", role: "img", viewBox: "0 0 24 24", children: jsx("path", { d: "M3 9h4l5-5v16l-5-5H3V9m13.59 3L14 9.41L15.41 8L18 10.59L20.59 8L22 9.41L19.41 12L22 14.59L20.59 16L18 13.41L15.41 16L14 14.59L16.59 12z", fill: "currentColor" }) })); };
var UnmutedVolumeIcon = function () { return (jsx("svg", { xmlns: "http://www.w3.org/2000/svg", "aria-hidden": "true", role: "img", viewBox: "0 0 24 24", children: jsx("path", { d: "M14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.84-5 6.7v2.07c4-.91 7-4.49 7-8.77c0-4.28-3-7.86-7-8.77M16.5 12c0-1.77-1-3.29-2.5-4.03V16c1.5-.71 2.5-2.24 2.5-4M3 9v6h4l5 5V4L7 9H3z", fill: "currentColor" }) })); };

var formatTime = function (time) {
    var minutes = Math.floor(time / 60);
    var seconds = Math.floor(time % 60);
    return "".concat(minutes, ":").concat(seconds < 10 ? '0' : '').concat(seconds);
};
var AudioController = function (_a) {
    var _b, _c;
    var audioRef = _a.audioRef;
    var progressBarRef = useRef(null);
    var _d = useState(false), isPlaying = _d[0], setIsPlaying = _d[1];
    var _e = useState(false), isMuted = _e[0], setIsMuted = _e[1];
    var _f = useState(100), volume = _f[0], setVolume = _f[1];
    var _g = useState(0), progress = _g[0], setProgress = _g[1];
    var handleVolume = function (event) {
        if (audioRef.current) {
            var barWidth = event.currentTarget.offsetWidth;
            var clickPosition = event.nativeEvent.offsetX;
            var newVolume = clickPosition / barWidth;
            audioRef.current.volume = newVolume;
            setVolume(newVolume * 100);
        }
    };
    var handlePlayPause = function () {
        if (audioRef.current) {
            if (audioRef.current.paused) {
                audioRef.current.play();
                setIsPlaying(true);
            }
            else {
                audioRef.current.pause();
                setIsPlaying(false);
            }
        }
    };
    var handleMuteUnmute = function () {
        if (audioRef.current) {
            audioRef.current.muted = !audioRef.current.muted;
            setIsMuted(audioRef.current.muted);
        }
    };
    var handleSeek = function (e) {
        if (audioRef.current) {
            var progressContainer = e.currentTarget;
            var seekTime = (e.nativeEvent.offsetX / progressContainer.offsetWidth) *
                audioRef.current.duration;
            audioRef.current.currentTime = seekTime;
        }
    };
    useEffect(function () {
        var audio = audioRef.current;
        var updateProgress = function () {
            if (audio && progressBarRef.current) {
                var progress_1 = (audio.currentTime / audio.duration) * 100;
                progressBarRef.current.style.width = "".concat(progress_1, "%");
                setProgress(progress_1);
            }
        };
        var handleAudioEnd = function () {
            if (audio) {
                audio.pause();
                setIsPlaying(false);
            }
        };
        if (audio) {
            audio.addEventListener('timeupdate', updateProgress);
            audio.addEventListener('ended', handleAudioEnd);
        }
        return function () {
            if (audio) {
                audio.removeEventListener('timeupdate', updateProgress);
                audio.addEventListener('ended', handleAudioEnd);
            }
        };
    }, [audioRef.current]);
    return (jsxs("div", { className: "rhap_main rhap_horizontal-reverse", children: [jsxs("div", { className: "rhap_progress-section", children: [jsx("div", { id: "rhap_current-time", className: "rhap_time rhap_current-time", children: formatTime(((_b = audioRef.current) === null || _b === void 0 ? void 0 : _b.currentTime) || 0) }), jsx("div", { className: "rhap_time", children: "/" }), jsx("div", { className: "rhap_time rhap_total-time", children: formatTime(((_c = audioRef.current) === null || _c === void 0 ? void 0 : _c.duration) || 0) }), jsx("div", { className: "rhap_progress-container", role: "progressbar", "aria-valuemin": 0, "aria-valuemax": 100, "aria-valuenow": progress, onClick: handleSeek, children: jsx("div", { className: "rhap_progress-bar", children: jsx("div", { ref: progressBarRef, className: "rhap_progress-indicator", style: {
                                    width: "".concat(progress, "%"),
                                } }) }) }), jsxs("div", { className: "rhap_volume-container", children: [jsx("button", { type: "button", className: "rhap_button-clear rhap_volume-button", onClick: handleMuteUnmute, children: isMuted ? jsx(MutedVolumeIcon, {}) : jsx(UnmutedVolumeIcon, {}) }), jsx("div", { role: "progressbar", "aria-label": "Volume control", "aria-valuemin": 0, "aria-valuemax": 100, "aria-valuenow": volume, tabIndex: 0, className: "rhap_volume-bar-area", onClick: handleVolume, children: jsx("div", { className: "rhap_volume-bar", children: jsx("div", { className: "rhap_volume-indicator", style: { left: "".concat(volume, "%") } }) }) })] })] }), jsx("div", { className: "rhap_controls-section", children: jsx("div", { className: "rhap_main-controls", children: jsx("button", { "aria-label": "Play", className: "rhap_button-clear rhap_main-controls-button rhap_play-pause-button", type: "button", onClick: handlePlayPause, children: isPlaying ? jsx(PauseIcon, {}) : jsx(PlayIcon, {}) }) }) })] }));
};

export { AudioController, AudioPlayer, AudioSVGImage, Border, BorderNotification, Button, ChatBlock, ChatMessage, Input, NotificationBubble, Sidebar, SidebarBlock, SmallLogo, VideoPlayer };
