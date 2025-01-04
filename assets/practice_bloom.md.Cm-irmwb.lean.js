import{_ as n,c as s,a0 as e,o as p}from"./chunks/framework.ToOB-GtV.js";const b=JSON.parse('{"title":"3.基于BloomFilter快速检查邮箱重复","description":"","frontmatter":{},"headers":[],"relativePath":"practice/bloom.md","filePath":"practice/bloom.md"}'),t={name:"practice/bloom.md"};function i(l,a,o,r,c,d){return p(),s("div",null,a[0]||(a[0]=[e(`<h1 id="_3-基于bloomfilter快速检查邮箱重复" tabindex="-1">3.基于BloomFilter快速检查邮箱重复 <a class="header-anchor" href="#_3-基于bloomfilter快速检查邮箱重复" aria-label="Permalink to &quot;3.基于BloomFilter快速检查邮箱重复&quot;">​</a></h1><p>在我的项目中，要求邮箱是不能重复的，常规的做法是去数据库中先查询一次，判断邮箱是否已经存在，如果存在则不让用户进行注册</p><p>但是为了考虑性能，我们可以将邮箱存储到缓存中，因此我们可以借助布隆过滤器来进行判断</p><p>这里为什么不使用其他redis结构呢，是因为布隆过滤器使用0-1bit数组来存储，相较于其他数据结构更加节省空间</p><p>它的基本原理是利用多个哈希函数，将一个元素映射成多个位，然后将这些位设置为 1。当查询一个元素时，如果这些位都被设置为 1，则认为元素<strong>可能</strong>存在于集合中，否则肯定不存在</p><p><strong>所以，布隆过滤器可以准确的判断一个元素是否一定不存在，但是因为哈希冲突的存在，所以他没办法判断一个元素一定存在。只能判断可能存在。</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public boolean nickNameExist(String nickName) {</span></span>
<span class="line"><span>    //如果布隆过滤器中存在，再进行数据库二次判断</span></span>
<span class="line"><span>    if (this.bloomFilter.contains(nickName)) {</span></span>
<span class="line"><span>        return userMapper.findByNickname(nickName) != null;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return false;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private boolean addNickName(String nickName) {</span></span>
<span class="line"><span>    return this.bloomFilter.add(nickName);</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="如果该用户被注销怎么办" tabindex="-1">如果该用户被注销怎么办？ <a class="header-anchor" href="#如果该用户被注销怎么办" aria-label="Permalink to &quot;如果该用户被注销怎么办？&quot;">​</a></h4><p>其实问题也不大，因为布隆过滤器本身就存在误判率，但我们检查布隆过滤器发现存在的时候，还是会去数据库再确认一遍的。</p><p>只要我们定期的重建一下布隆过滤器就行了。重建就是都删了，然后重新构建。</p>`,10)]))}const h=n(t,[["render",i]]);export{b as __pageData,h as default};
