import{_ as n,c as a,a0 as p,o as e}from"./chunks/framework.ToOB-GtV.js";const g=JSON.parse('{"title":"4.基于 SpringCloudGateway+SaToken 实现统一鉴权","description":"","frontmatter":{},"headers":[],"relativePath":"practice/auth.md","filePath":"practice/auth.md"}'),l={name:"practice/auth.md"};function t(i,s,c,r,o,u){return e(),a("div",null,s[0]||(s[0]=[p(`<h1 id="_4-基于-springcloudgateway-satoken-实现统一鉴权" tabindex="-1">4.基于 SpringCloudGateway+SaToken 实现统一鉴权 <a class="header-anchor" href="#_4-基于-springcloudgateway-satoken-实现统一鉴权" aria-label="Permalink to &quot;4.基于 SpringCloudGateway+SaToken 实现统一鉴权&quot;">​</a></h1><p>我们这里选用satoken作为权限框架，为什么不使用security呢，因为我们的项目没有特别复杂的权限控制</p><p>角色主要分为管理员和普通用户</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Configuration</span></span>
<span class="line"><span>public class SaTokenConfigure {</span></span>
<span class="line"><span>    // 注册 Sa-Token全局过滤器</span></span>
<span class="line"><span>    @Bean</span></span>
<span class="line"><span>    public SaReactorFilter getSaReactorFilter() {</span></span>
<span class="line"><span>        return new SaReactorFilter()</span></span>
<span class="line"><span>                // 拦截地址</span></span>
<span class="line"><span>                .addInclude(&quot;/**&quot;)    /* 拦截全部path */</span></span>
<span class="line"><span>                // 开放地址</span></span>
<span class="line"><span>                .addExclude(&quot;/favicon.ico&quot;)</span></span>
<span class="line"><span>                .addExclude(&quot;/doc.html&quot;)</span></span>
<span class="line"><span>                .addExclude(&quot;/webjars/**&quot;)</span></span>
<span class="line"><span>                .addExclude(&quot;/auth/v3/**&quot;)</span></span>
<span class="line"><span>                .addExclude(&quot;/shop/v3/**&quot;)</span></span>
<span class="line"><span>                .addExclude(&quot;/accompany/v3/**&quot;)</span></span>
<span class="line"><span>                .addExclude(&quot;/v3/**&quot;)</span></span>
<span class="line"><span>                .addExclude(&quot;/swagger-ui.html&quot;)</span></span>
<span class="line"><span>                .addExclude(&quot;/swagger-resources/**&quot;)</span></span>
<span class="line"><span>                .addExclude(&quot;/article/articleList&quot;)</span></span>
<span class="line"><span>                .addExclude(&quot;/article/articleNotes&quot;)</span></span>
<span class="line"><span>                .addExclude(&quot;/article/articleStrategy&quot;)</span></span>
<span class="line"><span>                // 鉴权方法：每次访问进入</span></span>
<span class="line"><span>                .setAuth(obj -&gt; {</span></span>
<span class="line"><span>                    SaRouter.match(&quot;/**&quot;, &quot;/auth/user/**&quot;, () -&gt; StpUtil.checkLogin());</span></span>
<span class="line"><span>                })</span></span>
<span class="line"><span>                // 异常处理方法：每次setAuth函数出现异常时进入</span></span>
<span class="line"><span>                .setError(e -&gt; {</span></span>
<span class="line"><span>                    return SaResult.error(e.getMessage());</span></span>
<span class="line"><span>                })</span></span>
<span class="line"><span>                ;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Component</span></span>
<span class="line"><span>@Slf4j</span></span>
<span class="line"><span>public class StpInterfaceImpl implements StpInterface {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Autowired</span></span>
<span class="line"><span>    private SysUserRoleMapper sysUserRoleMapper;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Autowired</span></span>
<span class="line"><span>    private SysRoleMenuMapper sysRoleMenuMapper;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Autowired</span></span>
<span class="line"><span>    private SysMenuMapper sysMenuMapper;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Autowired</span></span>
<span class="line"><span>    private SysRoleMapper sysRoleMapper;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public List&lt;String&gt; getPermissionList(Object loginId, String loginType) {</span></span>
<span class="line"><span>        Integer userId = Integer.valueOf((String) loginId);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        SysUserRole sysUserRole = sysUserRoleMapper.selectById(userId);</span></span>
<span class="line"><span>        if (sysUserRole == null) {</span></span>
<span class="line"><span>            return null;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        Integer roleId = sysUserRole.getRoleId();</span></span>
<span class="line"><span>        LambdaQueryWrapper&lt;SysRoleMenu&gt; wrapper = Wrappers.lambdaQuery();</span></span>
<span class="line"><span>        wrapper.eq(SysRoleMenu::getRoleId, roleId);</span></span>
<span class="line"><span>        List&lt;SysRoleMenu&gt; sysRoleMenus = sysRoleMenuMapper.selectList(wrapper);</span></span>
<span class="line"><span>        List&lt;Integer&gt; list = sysRoleMenus.stream()</span></span>
<span class="line"><span>                .map(sysRoleMenu -&gt; sysRoleMenu.getMenuId())</span></span>
<span class="line"><span>                .collect(Collectors.toList());</span></span>
<span class="line"><span>        List&lt;SysMenu&gt; sysMenus = sysMenuMapper.selectBatchIds(list);</span></span>
<span class="line"><span>        List&lt;String&gt; perList = sysMenus.stream()</span></span>
<span class="line"><span>                .map(sysMenu -&gt; sysMenu.getPerms())</span></span>
<span class="line"><span>                .collect(Collectors.toList());</span></span>
<span class="line"><span>        return perList;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public List&lt;String&gt; getRoleList(Object loginId, String loginType) {</span></span>
<span class="line"><span>        Integer userId = Integer.valueOf((String) loginId);</span></span>
<span class="line"><span>        SysUserRole sysUserRole = sysUserRoleMapper.selectById(userId);</span></span>
<span class="line"><span>        Integer roleId = sysUserRole.getRoleId();</span></span>
<span class="line"><span>        SysRole sysRole = sysRoleMapper.selectById(roleId);</span></span>
<span class="line"><span>        if (sysUserRole == null) {</span></span>
<span class="line"><span>            return null;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        List&lt;String&gt; list = new ArrayList&lt;&gt;();</span></span>
<span class="line"><span>        list.add(sysRole.getRoleKey());</span></span>
<span class="line"><span>        return list;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div>`,5)]))}const y=n(l,[["render",t]]);export{g as __pageData,y as default};
