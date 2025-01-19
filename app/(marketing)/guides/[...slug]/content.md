## !intro Why Setting a Correct Language on an HTML Document is Crucial

## !!steps Document Must Have a Language

Specifying the language of an HTML document is more than a best practice — it’s essential for accessibility, SEO, and proper browser behavior. By setting the `lang` attribute, you ensure your content is correctly interpreted and accessible to users across different languages and abilities.

```html ! uk.html
<html>
  <title>This title should be translated by Google Docs</title>
</html>
```

## !!steps With Document language

By specifying `lang="en"` (English), you enable browsers, translation tools, and screen readers to recognize the content's language. This leads to accurate pronunciation, improved translations, and better accessibility overall.


```html ! uk.html
<html lang="en">
  <title>Ця назва має бути перекладена за допомогою Google Translate</title>
</html>
```

## !outro Conclusion

Setting the correct language for your HTML document benefits everyone:

- **Improved Accessibility**: Screen readers can accurately read and interpret the content for visually impaired users.
- **Enhanced SEO**: Search engines use the lang attribute to better index and categorize your content.
- **User Experience**: Translation tools can seamlessly adapt the content to the user's preferred language.
